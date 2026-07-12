import { useState, useEffect } from "react";
import { Plus, ShoppingBag, X, Trash2, Store, Check, MessageCircle, Wallet } from "lucide-react";

const SHOP_NAME = "MIKE ODG 🇧🇫 DIRECT";
const WHATSAPP_NUMBER = "22667974106"; // format international sans le +
const ORANGE_MONEY_NUMBER = "+226 67 97 41 06";

const fmt = (n) => Number(n).toLocaleString("fr-FR") + " FCFA";
const waLink = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const addToCart = (p) => setCart((c) => [...c, p]);
  const removeFromCart = (idx) => setCart((c) => c.filter((_, i) => i !== idx));
  const total = cart.reduce((s, i) => s + Number(i.price), 0);

  const submitOrder = async (info, method) => {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: info.name,
        phone: info.phone,
        address: info.address,
        items: cart,
        total,
        payment_method: method,
      }),
    });
  };

  return (
    <div>
      <header style={styles.hero}>
        <div style={styles.brand}><Store size={20} /> {SHOP_NAME}</div>
        <button style={styles.cartBtn} onClick={() => setShowCart(true)}>
          <ShoppingBag size={18} /> {cart.length > 0 && `(${cart.length})`}
        </button>
      </header>

      <main style={styles.grid}>
        {loading && <p>Chargement…</p>}
        {!loading && products.length === 0 && <p>Aucun produit pour l'instant.</p>}
        {products.map((p) => (
          <div key={p.id} style={styles.card}>
            {p.image_url && <img src={p.image_url} alt={p.name} style={styles.img} />}
            <h4>{p.name}</h4>
            <p>{p.description}</p>
            <strong>{fmt(p.price)}</strong>
            <button style={styles.addBtn} onClick={() => addToCart(p)}><Plus size={14} /> Ajouter</button>
            <a
              style={styles.waMini}
              href={waLink(`Bonjour, je suis intéressé(e) par : ${p.name} (${fmt(p.price)}). Est-ce disponible ?`)}
              target="_blank" rel="noopener noreferrer"
            >
              <MessageCircle size={12} /> Demander sur WhatsApp
            </a>
          </div>
        ))}
      </main>

      <a style={styles.waFloat} href={waLink(`Bonjour ${SHOP_NAME}, j'ai une question sur vos produits.`)} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={24} />
      </a>

      {showCart && (
        <div style={styles.overlay} onClick={() => setShowCart(false)}>
          <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowCart(false)}><X size={18} /></button>
            <h3>Panier</h3>
            {cart.map((it, idx) => (
              <div key={idx} style={styles.row}>
                <span>{it.name} — {fmt(it.price)}</span>
                <button onClick={() => removeFromCart(idx)}><Trash2 size={14} /></button>
              </div>
            ))}
            <p><strong>Total : {fmt(total)}</strong></p>
            {cart.length > 0 && (
              <button style={styles.addBtn} onClick={() => { setShowCart(false); setShowCheckout(true); }}>
                Commander
              </button>
            )}
          </div>
        </div>
      )}

      {showCheckout && (
        <CheckoutForm
          items={cart}
          total={total}
          onClose={() => setShowCheckout(false)}
          onSubmitOrder={submitOrder}
          onDone={() => setCart([])}
        />
      )}
    </div>
  );
}

function CheckoutForm({ items, total, onClose, onSubmitOrder, onDone }) {
  const [info, setInfo] = useState({ name: "", phone: "", address: "" });
  const [method, setMethod] = useState("orange");
  const [done, setDone] = useState(false);

  const orderSummary = () => {
    const lines = items.map((i) => `- ${i.name} (${fmt(i.price)})`).join("\n");
    return `Bonjour, je viens de passer une commande sur ${SHOP_NAME} :\n${lines}\nTotal : ${fmt(total)}\nNom : ${info.name}\nTéléphone : ${info.phone}\nAdresse : ${info.address}\nPaiement : ${method === "orange" ? "Orange Money" : "À la livraison"}`;
  };

  const submit = async () => {
    if (!info.name || !info.phone || !info.address) return;
    await onSubmitOrder(info, method);
    setDone(true);
    onDone();
  };

  if (done) {
    return (
      <div style={styles.overlay}>
        <div style={{ ...styles.panel, textAlign: "center" }}>
          <h3>Commande confirmée 🎉</h3>
          <p>Envoyez-nous un message WhatsApp pour finaliser rapidement.</p>
          <a style={styles.waBtn} href={waLink(orderSummary())} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} /> Confirmer sur WhatsApp
          </a>
          <button style={{ ...styles.addBtn, background: "none", color: "#1F2A24", border: "1.5px solid #ddd", marginTop: 10 }} onClick={onClose}>
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}><X size={18} /></button>
        <h3>Vos informations</h3>
        <input style={styles.input} placeholder="Nom" value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
        <input style={styles.input} placeholder="Téléphone" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
        <input style={styles.input} placeholder="Adresse" value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })} />

        <div style={{ display: "flex", gap: 8, margin: "10px 0" }}>
          <button
            style={{ ...styles.payOpt, ...(method === "orange" ? styles.payOptActive : {}) }}
            onClick={() => setMethod("orange")}
          >Orange Money</button>
          <button
            style={{ ...styles.payOpt, ...(method === "livraison" ? styles.payOptActive : {}) }}
            onClick={() => setMethod("livraison")}
          >À la livraison</button>
        </div>

        {method === "orange" && (
          <div style={styles.omBox}>
            <Wallet size={16} />
            <div>
              <div style={{ fontSize: 11.5 }}>Effectuez le dépôt à ce numéro Orange Money</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{ORANGE_MONEY_NUMBER}</div>
            </div>
          </div>
        )}

        <button style={styles.addBtn} onClick={submit}><Check size={14} /> Confirmer la commande</button>
      </div>
    </div>
  );
}

const styles = {
  hero: { background: "#1F2A24", color: "#fff", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 },
  brand: { display: "flex", alignItems: "center", gap: 8, fontWeight: 600 },
  cartBtn: { background: "none", border: "1px solid #fff", color: "#fff", borderRadius: 8, padding: "6px 10px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 16, padding: 20, maxWidth: 960, margin: "0 auto" },
  card: { background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 12 },
  img: { width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8, marginBottom: 8 },
  addBtn: { background: "#1F2A24", color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", marginTop: 8, cursor: "pointer", width: "100%" },
  waMini: { display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 11, color: "#25D366", textDecoration: "none", marginTop: 6, fontWeight: 500 },
  waFloat: { position: "fixed", bottom: 20, right: 20, width: 52, height: 52, background: "#25D366", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(0,0,0,0.25)" },
  waBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25D366", color: "#fff", textDecoration: "none", padding: 12, borderRadius: 10, fontWeight: 600, marginTop: 14 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 },
  panel: { background: "#fff", borderRadius: 14, padding: 20, width: "100%", maxWidth: 380, maxHeight: "85vh", overflowY: "auto" },
  row: { display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #eee" },
  input: { width: "100%", boxSizing: "border-box", padding: 10, borderRadius: 8, border: "1px solid #ddd", marginTop: 8 },
  payOpt: { flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" },
  payOptActive: { background: "#1F2A24", color: "#fff", borderColor: "#1F2A24" },
  omBox: { display: "flex", gap: 10, alignItems: "center", background: "#FFF1DC", border: "1px solid #F0D6A6", borderRadius: 10, padding: "10px 12px", color: "#8A5A1F", marginBottom: 10 },
};
