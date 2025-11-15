import { useEffect, useMemo, useState } from "react";
import "./Contato.css";
import { useLanguage } from "../../hooks/useLanguage";

const INITIAL_FORM = { name: "", email: "", message: "" };

const COPY = {
	pt: {
		heading: "Vamos conversar?",
		description:
			"Estou sempre aberto a novas oportunidades e colaborações. Se você tem um projeto em mente ou apenas quer dizer oi, preencha o formulário abaixo.",
		name: "Seu nome",
		email: "Seu e-mail",
		message: "Sua mensagem",
		submit: "Enviar mensagem",
		sending: "Enviando...",
		success: "Mensagem enviada com sucesso! Responderei em breve.",
		error: "Não foi possível enviar. Tente novamente.",
	},
	en: {
		heading: "Let's Talk?",
		description:
			"I'm always open to new opportunities and collaborations. If you have a project in mind or just want to say hi, fill out the form below.",
		name: "Your Name",
		email: "Your Email",
		message: "Your Message",
		submit: "Send Message",
		sending: "Sending...",
		success: "Message sent successfully! I'll reply soon.",
		error: "Could not send. Please try again.",
	},
};

export default function Contato() {
	const lang = useLanguage();
	const [formValues, setFormValues] = useState(INITIAL_FORM);
	const [status, setStatus] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const copy = useMemo(() => COPY[lang] || COPY.pt, [lang]);

	useEffect(() => {
		setStatus("");
	}, [lang]);

	const onInputChange = (event) => {
		const { name, value } = event.target;
		setFormValues((prev) => ({ ...prev, [name]: value }));
		if (value.trim()) {
			event.target.dataset.hasValue = "true";
		} else {
			delete event.target.dataset.hasValue;
		}
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		setStatus("");

		const form = event.currentTarget;

		try {
			// Serviço FormSubmit para disparo de e-mails sem backend dedicado
			const formData = new FormData();
			formData.append("name", formValues.name);
			formData.append("email", formValues.email);
			formData.append("message", formValues.message);
			formData.append("_subject", `Contato de ${formValues.name} - Portfolio`);
			formData.append("_captcha", "false");

			const response = await fetch("https://formsubmit.co/israelcunhaolive@gmail.com", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				setStatus("success");
				setFormValues(INITIAL_FORM);
				form.reset();
				form.querySelectorAll(".form-input").forEach((input) => {
					delete input.dataset.hasValue;
				});

				setTimeout(() => setStatus(""), 5000);
			} else {
				throw new Error("Erro ao enviar");
			}
		} catch (error) {
			console.error("Erro ao enviar email:", error);
			setStatus("error");
			setTimeout(() => setStatus(""), 5000);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section
			id="contato"
			className="contact-section"
			aria-label={copy.heading}
			data-section="contact"
		>
			<div className="contact-inner">
				<h2 className="contact-heading">{copy.heading}</h2>
				<p className="contact-description">{copy.description}</p>

				<form className="contact-form" onSubmit={onSubmit} noValidate>
					<div className="form-group">
						<input
							type="text"
							id="name"
							name="name"
							placeholder=" "
							className="form-input"
							required
							value={formValues.name}
							onChange={onInputChange}
							aria-label={copy.name}
						/>
						<label htmlFor="name" className="form-label">
							{copy.name}
						</label>
					</div>
					<div className="form-group">
						<input
							type="email"
							id="email"
							name="email"
							placeholder=" "
							className="form-input"
							required
							value={formValues.email}
							onChange={onInputChange}
							aria-label={copy.email}
						/>
						<label htmlFor="email" className="form-label">
							{copy.email}
						</label>
					</div>
					<div className="form-group">
						<textarea
							id="message"
							name="message"
							placeholder=" "
							rows={4}
							className="form-input"
							required
							value={formValues.message}
							onChange={onInputChange}
							aria-label={copy.message}
						/>
						<label htmlFor="message" className="form-label">
							{copy.message}
						</label>
					</div>
					<button type="submit" className="submit-button" disabled={isSubmitting}>
						{isSubmitting ? copy.sending : copy.submit}
					</button>
				</form>
				{status && (
					<p className={`contact-status ${status}`}>
						{status === "success" ? copy.success : status === "error" ? copy.error : ""}
					</p>
				)}
			</div>
		</section>
	);
}
