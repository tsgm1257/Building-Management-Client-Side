import Section from "../components/Section";
import Container from "../components/Container";

const Contact = () => {
  return (
    <Section>
      <Container>
        <div className="max-w-2xl mx-auto bg-base-100 rounded-xl shadow border border-base-300 p-6">
          <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
          <p className="text-base-content/80 mb-6">
            Have a question about the building, payments, or memberships? Send
            us a message and we’ll get back to you.
          </p>

          <form
            action="mailto:support@mybuilding.example"
            method="post"
            encType="text/plain"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="form-control">
                <span className="label-text">Your Name</span>
                <input className="input input-bordered" name="name" required />
              </label>
              <label className="form-control">
                <span className="label-text">Email</span>
                <input
                  type="email"
                  className="input input-bordered"
                  name="email"
                  required
                />
              </label>
            </div>

            <label className="form-control mt-4">
              <span className="label-text">Subject</span>
              <input className="input input-bordered" name="subject" required />
            </label>

            <label className="form-control mt-4">
              <span className="label-text">Message</span>
              <textarea
                className="textarea textarea-bordered h-32"
                name="message"
                required
              />
            </label>

            <div className="mt-6 flex gap-3">
              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
              <a
                href="mailto:support@mybuilding.example"
                className="btn btn-outline"
              >
                Email Directly
              </a>
            </div>
          </form>
        </div>
      </Container>
    </Section>
  );
};

export default Contact;
