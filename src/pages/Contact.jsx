// src/pages/Contact.jsx
import { useState } from "react";
import Section from "../components/Section";
import Container from "../components/Container";
import toast from "react-hot-toast";
import Location from "../components/Location";

const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL || "support@mybuilding.com";

const Contact = () => {
  const [isSending, setIsSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      toast.error("Please fill out all fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Please enter a valid email.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSending(true);
    try {
      // Client-only email send via FormSubmit
      const res = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(SUPPORT_EMAIL)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            _subject: form.subject,
            message: form.message,
            _captcha: "false", // disable CAPTCHA prompt
            _template: "table", // nicer email formatting
          }),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !(data?.success === true || data?.success === "true")) {
        throw new Error(data?.message || "Failed to send");
      }

      toast.success("Message sent!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Contact send failed:", err);
      toast.error("Failed to send. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Section>
      <Container>
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 opacity-80">
            Questions about apartments, payments, or memberships? Send us a
            message.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Info + Map */}
          <div className="card bg-base-100 shadow-sm rounded-2xl">
            <div className="card-body">
              <h2 className="card-title">Office Information</h2>
              <div className="space-y-3 mt-2 text-sm">
                <p>
                  <span className="font-medium">Address:</span> 8181
                  Communications Pkwy, Plano, TX
                </p>
                <p>
                  <span className="font-medium">Phone:</span> (555) 123-4567
                </p>
                <p>
                  <span className="font-medium">Email:</span> {SUPPORT_EMAIL}
                </p>
                <p className="opacity-80">
                  Our team is available Mon–Fri, 9:00 AM – 5:00 PM (CT).
                </p>
              </div>

              {/* Map with controlled height to match layout */}
              <div className="mt-4">
                <div className="w-full h-64 rounded-xl overflow-hidden">
                  <Location />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact form */}
          <div className="card bg-base-100 shadow-sm rounded-2xl">
            <form className="card-body" onSubmit={handleSubmit}>
              <h2 className="card-title">Send a Message</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="form-control">
                  <span className="label-text">Your Name</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="input input-bordered rounded-xl w-full"
                    placeholder="John Smith"
                    required
                    disabled={isSending}
                  />
                </label>

                <label className="form-control">
                  <span className="label-text">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input input-bordered rounded-xl w-full"
                    placeholder="you@example.com"
                    required
                    disabled={isSending}
                  />
                </label>
              </div>

              <label className="form-control">
                <span className="label-text">Subject</span>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="input input-bordered rounded-xl w-full"
                  placeholder="How can we help?"
                  required
                  disabled={isSending}
                />
              </label>

              <label className="form-control">
                <span className="label-text">Message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="textarea textarea-bordered rounded-xl w-full min-h-[140px]"
                  placeholder="Write your message..."
                  required
                  disabled={isSending}
                />
              </label>

              <div className="pt-1">
                <button
                  type="submit"
                  className="btn btn-primary rounded-xl"
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Contact;
