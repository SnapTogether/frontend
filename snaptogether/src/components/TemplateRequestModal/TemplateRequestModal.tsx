"use client";

import { useState } from "react";
import { requestTemplate, RequestTemplateData } from "@/api/event";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button/Button";

interface TemplateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateRequestModal({ isOpen, onClose }: TemplateRequestModalProps) {
  const [formData, setFormData] = useState<RequestTemplateData>({
    name: "",
    mobile: "",
    eventName: "",
    address: "",
    message: "",
    template: "Wedding Classic",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  
    const response = await requestTemplate(formData);
  
    if (response.status === 201) {
      setSuccessMessage("✅ Template request sent successfully!");
  
      setTimeout(() => {
        setSuccessMessage(null);
        setFormData({
          name: "",
          mobile: "",
          eventName: "",
          address: "",
          message: "",
          template: "Wedding Classic", // Reset to default option
        });
        onClose();
      }, 2000);
    } else {
      setErrorMessage(response.message || "❌ Failed to send request.");
    }
  
    setLoading(false);
  };  

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-lg z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close when clicking outside the modal
        >
          <motion.div
            className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing on content click
          >
            <h2 className="text-xl font-semibold text-center">Request a Custom Template</h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Your Mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="text"
                name="eventName"
                placeholder="Event Name"
                value={formData.eventName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Your Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
              <textarea
                name="message"
                placeholder="Message (Details about your template request)"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                rows={3}
                required
              />
              <select
                name="template"
                value={formData.template}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="Wedding Classic">Wedding Classic</option>
                <option value="Birthday Fun">Birthday Fun</option>
                <option value="Corporate Event">Corporate Event</option>
              </select>

              {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}
              {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
              >
                {loading ? "Submitting..." : "Request Template"}
              </Button>
            </form>

            <Button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
