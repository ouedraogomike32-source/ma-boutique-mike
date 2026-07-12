import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { name, price, description, image_url } = req.body;
    if (!name || !price) return res.status(400).json({ error: "Nom et prix requis" });

    const { data, error } = await supabase
      .from("products")
      .insert([{ name, price, description, image_url }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  res.status(405).json({ error: "Méthode non autorisée" });
}
