import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { customer_name, phone, address, items, total, payment_method } = req.body;

  if (!customer_name || !phone || !address || !items?.length) {
    return res.status(400).json({ error: "Informations manquantes" });
  }

  const { data, error } = await supabase
    .from("orders")
    .insert([{ customer_name, phone, address, items, total, payment_method }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data[0]);
}
