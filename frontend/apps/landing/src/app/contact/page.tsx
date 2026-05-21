import { ContactForm } from './contact-form';

export default function ContactPage() {
  return (
    <div className="pt-32 px-4 pb-24 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-4">Contact</h1>
      <p className="text-gray-400 mb-8">
        Questions about challenges, partnerships, or the platform? Reach out — or jump straight into the app.
      </p>
      <ContactForm />
    </div>
  );
}
