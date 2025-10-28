import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateResumePDF = async (resume: any) => {
  const outputDir = path.join(process.cwd(), "generated");
  const outputPath = path.join(outputDir, `${resume.name}-resume.pdf`);

  fs.mkdirSync(outputDir, { recursive: true });

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(outputPath));

  // Header
  doc.font("Helvetica-Bold").fontSize(22).text(resume.name, { align: "center" });
  doc.moveDown(0.3);
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      `${resume.phone ?? ""} | ${resume.email ?? ""} | ${resume.github ?? ""}`,
      { align: "center" }
    );
  doc.moveDown(1);

  // Skills
  doc.font("Helvetica-Bold").fontSize(14).text("Skills");
  doc.moveDown(0.3);
  const s = resume.skills || {};
  doc.font("Helvetica").fontSize(10);
  if (s.frontend) doc.text(`Frontend: ${s.frontend.join(", ")}`);
  if (s.backend) doc.text(`Backend: ${s.backend.join(", ")}`);
  if (s.tools) doc.text(`Tools: ${s.tools.join(", ")}`);
  if (s.soft) doc.text(`Soft: ${s.soft.join(", ")}`);
  doc.moveDown(1);

  // Education
  doc.font("Helvetica-Bold").fontSize(14).text("Education");
  doc.moveDown(0.3);
  (resume.education || []).forEach((edu: any) => {
    doc.font("Helvetica-Bold").text(`${edu.school}`, { continued: true });
    doc.font("Helvetica").text(` — ${edu.degree} (${edu.year})`);
    if (edu.location) doc.text(edu.location);
    doc.moveDown(0.5);
  });
  doc.moveDown(1);

  // Projects
  doc.font("Helvetica-Bold").fontSize(14).text("Projects");
  doc.moveDown(0.3);
  (resume.projects || []).forEach((p: any) => {
    doc.font("Helvetica-Bold").text(`${p.name} | ${p.tech}`);
    doc.font("Helvetica").text(`- ${p.description}`);
    if (p.link)
      doc.fillColor("blue").text(p.link, { link: p.link }).fillColor("black");
    doc.moveDown(0.7);
  });

  // Certifications
  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(14).text("Certifications");
  doc.moveDown(0.3);
  (resume.certifications || []).forEach((c: any) => {
    doc.font("Helvetica").text(`• ${c.name} — ${c.issuer}`);
  });

  // Experience
  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(14).text("Experience");
  doc.moveDown(0.3);
  (resume.experience || []).forEach((exp: any) => {
    doc.font("Helvetica-Bold").text(`${exp.company} — ${exp.position}`);
    doc.font("Helvetica").text(`${exp.duration}`);
    if (exp.description) doc.text(exp.description);
    doc.moveDown(0.5);
  });

  doc.end();

  return outputPath;
};
