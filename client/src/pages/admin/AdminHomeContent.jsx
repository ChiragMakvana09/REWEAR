import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useToast } from "../../context/ToastContext";

export default function AdminHomeContent() {
  const [form, setForm] = useState({
    heroTitle: "", heroSubtitle: "", heroButtonText: "",
    promoBannerText: "", footerTagline: "",
    socialLinks: { instagram: "", twitter: "", facebook: "", pinterest: "" },
  });
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [currentHeroImage, setCurrentHeroImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    axiosInstance.get("/home").then((res) => {
      const c = res.data.homeContent;
      setForm({
        heroTitle: c.heroTitle || "",
        heroSubtitle: c.heroSubtitle || "",
        heroButtonText: c.heroButtonText || "",
        promoBannerText: c.promoBannerText || "",
        footerTagline: c.footerTagline || "",
        socialLinks: c.socialLinks || { instagram: "", twitter: "", facebook: "", pinterest: "" },
      });
      setCurrentHeroImage(c.heroImage?.url || "");
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSocialChange = (e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [e.target.name]: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      ["heroTitle", "heroSubtitle", "heroButtonText", "promoBannerText", "footerTagline"].forEach((k) => data.append(k, form[k]));
      data.append("socialLinks", JSON.stringify(form.socialLinks));
      if (heroImageFile) data.append("heroImage", heroImageFile);

      await axiosInstance.put("/admin/home", data, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Home content updated");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not save", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-[720px] mx-auto px-8 py-24 text-center opacity-60">Loading...</div>;

  return (
    <div className="max-w-[720px] mx-auto px-8 py-16">
      <h1 className="text-4xl font-display mb-10">Home Page Content</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs uppercase tracking-wide opacity-60 mb-2 block">Hero Title</label>
          <input name="heroTitle" value={form.heroTitle} onChange={handleChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm w-full" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide opacity-60 mb-2 block">Hero Subtitle</label>
          <textarea name="heroSubtitle" value={form.heroSubtitle} onChange={handleChange} rows={2} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm w-full" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide opacity-60 mb-2 block">Hero Button Text</label>
          <input name="heroButtonText" value={form.heroButtonText} onChange={handleChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm w-full" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide opacity-60 mb-2 block">Hero Image</label>
          {currentHeroImage && <img src={currentHeroImage} alt="" className="w-32 aspect-[4/5] object-cover rounded-sm mb-2" />}
          <input type="file" accept="image/*" onChange={(e) => setHeroImageFile(e.target.files[0])} className="text-sm" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide opacity-60 mb-2 block">Promo Banner Text</label>
          <input name="promoBannerText" value={form.promoBannerText} onChange={handleChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm w-full" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide opacity-60 mb-2 block">Footer Tagline</label>
          <textarea name="footerTagline" value={form.footerTagline} onChange={handleChange} rows={2} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wide opacity-60 mb-2 block">Instagram URL</label>
            <input name="instagram" value={form.socialLinks.instagram} onChange={handleSocialChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm w-full" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide opacity-60 mb-2 block">Twitter/X URL</label>
            <input name="twitter" value={form.socialLinks.twitter} onChange={handleSocialChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm w-full" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide opacity-60 mb-2 block">Facebook URL</label>
            <input name="facebook" value={form.socialLinks.facebook} onChange={handleSocialChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm w-full" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide opacity-60 mb-2 block">Pinterest URL</label>
            <input name="pinterest" value={form.socialLinks.pinterest} onChange={handleSocialChange} className="bg-putty-light border border-line rounded-sm px-4 py-3 text-sm w-full" />
          </div>
        </div>

        <button disabled={saving} className="btn-primary mt-2">{saving ? "Saving..." : "Save Home Content"}</button>
      </form>
    </div>
  );
}
