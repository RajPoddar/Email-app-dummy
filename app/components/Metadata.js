export const metadata = {
    title: "Email Marketing App",
    description: "Generated by pressKnow digital",
  };
  
  export default function Metadata() {
    return (
      <>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </>
    );
  }
  