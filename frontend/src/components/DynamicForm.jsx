import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function DynamicForm({ slug, lang }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/forms/${slug}`);
        setForm(response.data);
      } catch (error) {
        console.error('Failed to fetch form', error);
        setForm(null);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [slug]);

  const handleChange = (fieldId, value) => {
    setPayload((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API}/forms/${slug}/submit`, payload);
      const message = lang === 'en' && form?.submit_message_en ? form.submit_message_en : form?.submit_message;
      toast.success(message || 'Form submitted');
      setPayload({});
    } catch (error) {
      console.error('Form submit failed', error);
      toast.error('Submission failed');
    }
  };

  if (loading) {
    return <p className="text-white/60">Loading...</p>;
  }

  if (!form) {
    return <p className="text-white/60">Form not available.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-2xl font-bold font-heading text-white">
        {lang === 'en' && form.title_en ? form.title_en : form.title}
      </h3>
      {form.fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label className="text-white">
            {lang === 'en' && field.label_en ? field.label_en : field.label}
          </Label>
          {field.type === 'textarea' ? (
            <Textarea
              value={payload[field.id] || ''}
              onChange={(event) => handleChange(field.id, event.target.value)}
              className="bg-zinc-900/50 border-white/10 text-white"
              rows={4}
              required={field.required}
            />
          ) : field.type === 'select' ? (
            <select
              value={payload[field.id] || ''}
              onChange={(event) => handleChange(field.id, event.target.value)}
              className="bg-zinc-900/50 border border-white/10 text-white rounded-lg px-4 py-2 w-full"
              required={field.required}
            >
              <option value="">Select...</option>
              {((lang === 'en' && field.options_en?.length) ? field.options_en : field.options || []).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <Input
              type={field.type || 'text'}
              value={payload[field.id] || ''}
              onChange={(event) => handleChange(field.id, event.target.value)}
              className="bg-zinc-900/50 border-white/10 text-white"
              required={field.required}
            />
          )}
        </div>
      ))}
      <Button type="submit" className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-xl">
        Submit
      </Button>
    </form>
  );
}
