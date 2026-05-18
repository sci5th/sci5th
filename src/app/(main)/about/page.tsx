export const metadata = {
  title: "About",
  description:
    "About sci5th — how content is produced, what is AI-generated, and how to flag errors.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 justify-center px-4 py-8 md:px-8 md:py-12">
      <article className="w-full max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-medium tracking-tight text-text-100 md:text-4xl">
            About
          </h1>
          <p className="mt-3 text-base text-text-300 md:text-lg">
            sci5th is a prototype exploring the structure of human knowledge,
            with a focus on science and technology.
          </p>
        </header>

        <section className="mb-8 rounded-lg border border-line-700 bg-ink-900 p-5">
          <h2 className="text-lg font-medium text-text-100">
            How content is produced
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-300 md:text-base">
            The taxonomy in Human Knowledge is hand-curated. The step-by-step
            explainers in Knowledge Gallery are drafted with AI assistance, then
            lightly edited &mdash; they aim to follow the consensus view in each
            field, but they have not been reviewed by subject-matter experts.
            Treat them as a starting point for your own reading, not as a
            citation in their own right. If you spot an error, please report it.
          </p>
        </section>

        <section className="mb-8 rounded-lg border border-line-700 bg-ink-900 p-5">
          <h2 className="text-lg font-medium text-text-100">
            Images and other assets
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-300 md:text-base">
            Every image on the site is credited next to itself, on the card or
            hero where it appears. The credit names the source &mdash; which AI
            model generated it, or that it is original first-party work (the
            sci5th logo, site chrome, and any interactive demos). If the credit
            is missing, treat that as a bug and let us know.
          </p>
        </section>

        <section className="mb-8 rounded-lg border border-line-700 bg-ink-900 p-5">
          <h2 className="text-lg font-medium text-text-100">
            What this site is not
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-300 md:text-base">
            sci5th is not a peer-reviewed reference, not a textbook, and not a
            source of medical, legal, or financial advice. It is a working
            prototype intended to scale into something larger; the disclosures
            here will be revised as the project grows.
          </p>
        </section>

        <section className="rounded-lg border border-line-700 bg-ink-900 p-5">
          <h2 className="text-lg font-medium text-text-100">Report an error</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-300 md:text-base">
            Found a factual mistake, a broken link, or an image that should not
            be on the site? Please reach out at{" "}
            <a
              href="mailto:s_object@yahoo.com"
              className="decoration-text-700 underline underline-offset-2 transition-colors hover:text-text-100 focus-visible:text-text-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              s_object@yahoo.com
            </a>{" "}
            so we can correct it.
          </p>
        </section>
      </article>
    </div>
  );
}
