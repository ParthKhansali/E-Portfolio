const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

async function createResume() {
  const pdfDoc = await PDFDocument.create();
  
  // Base 14 standard fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const PAGE_WIDTH = 595.28; // Standard A4 width in pt
  const PAGE_HEIGHT = 841.89; // Standard A4 height in pt
  const MARGIN_LEFT = 48;
  const MARGIN_RIGHT = 48;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

  // Helper colors
  const black = rgb(0.08, 0.08, 0.08);
  const darkGray = rgb(0.2, 0.2, 0.2);
  const lightGray = rgb(0.65, 0.65, 0.65);
  const linkBlue = rgb(0.15, 0.25, 0.7);

  // Helper functions
  function drawSectionHeader(page, title, y) {
    page.drawText(title, {
      x: MARGIN_LEFT,
      y,
      size: 11.5,
      font: fontBold,
      color: black,
    });
    // Horizontal rule under section header
    page.drawLine({
      start: { x: MARGIN_LEFT, y: y - 3 },
      end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: y - 3 },
      thickness: 0.75,
      color: black,
    });
    return y - 16;
  }

  function drawBullet(page, text, y, indent = 12) {
    const bulletChar = "• ";
    const x = MARGIN_LEFT + indent;
    const bulletWidth = fontRegular.widthOfTextAtSize(bulletChar, 9);
    const availableWidth = CONTENT_WIDTH - indent - bulletWidth;

    // Word-wrap text
    const words = text.split(" ");
    let line = "";
    let isFirstLine = true;
    let currentY = y;

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = fontRegular.widthOfTextAtSize(testLine, 9);
      if (testWidth > availableWidth) {
        if (isFirstLine) {
          page.drawText(bulletChar, { x, y: currentY, size: 9, font: fontRegular, color: black });
          page.drawText(line, { x: x + bulletWidth, y: currentY, size: 9, font: fontRegular, color: darkGray });
          isFirstLine = false;
        } else {
          page.drawText(line, { x: x + bulletWidth, y: currentY, size: 9, font: fontRegular, color: darkGray });
        }
        currentY -= 12;
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      if (isFirstLine) {
        page.drawText(bulletChar, { x, y: currentY, size: 9, font: fontRegular, color: black });
        page.drawText(line, { x: x + bulletWidth, y: currentY, size: 9, font: fontRegular, color: darkGray });
      } else {
        page.drawText(line, { x: x + bulletWidth, y: currentY, size: 9, font: fontRegular, color: darkGray });
      }
      currentY -= 12;
    }

    return currentY;
  }

  // ==========================================
  // PAGE 1
  // ==========================================
  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y1 = PAGE_HEIGHT - 54;

  // Title: PARTH KHANSALI
  const name = "PARTH KHANSALI";
  const nameWidth = fontRegular.widthOfTextAtSize(name, 21);
  page1.drawText(name, {
    x: (PAGE_WIDTH - nameWidth) / 2,
    y: y1,
    size: 21,
    font: fontRegular,
    color: black,
  });
  y1 -= 14;

  // Subtitle: Dehradun, Uttarakhand
  const location = "Dehradun, Uttarakhand";
  const locWidth = fontRegular.widthOfTextAtSize(location, 9.5);
  page1.drawText(location, {
    x: (PAGE_WIDTH - locWidth) / 2,
    y: y1,
    size: 9.5,
    font: fontRegular,
    color: darkGray,
  });
  y1 -= 14;

  // Contact line: +91 7302908889   parthkhansali@gmail.com   LinkedIn
  const phone = "+91 7302908889";
  const email = "parthkhansali@gmail.com";
  const linkedin = "LinkedIn";
  const contactText = `${phone}   |   ${email}   |   ${linkedin}`;
  const contactWidth = fontRegular.widthOfTextAtSize(contactText, 9);
  const startContactX = (PAGE_WIDTH - contactWidth) / 2;
  page1.drawText(contactText, {
    x: startContactX,
    y: y1,
    size: 9,
    font: fontRegular,
    color: darkGray,
  });
  y1 -= 22;

  // --- EDUCATION ---
  y1 = drawSectionHeader(page1, "Education", y1);

  // Graphic Era Hill University
  page1.drawText("Graphic Era Hill University", { x: MARGIN_LEFT, y: y1, size: 9.5, font: fontBold, color: black });
  const gehuDate = "2024 - 2028";
  page1.drawText(gehuDate, {
    x: PAGE_WIDTH - MARGIN_RIGHT - fontBold.widthOfTextAtSize(gehuDate, 9.5),
    y: y1,
    size: 9.5,
    font: fontBold,
    color: black,
  });
  y1 -= 11.5;

  page1.drawText("Bachelor of Technology in Computer Science and Engineering (CGPA of 7.6)", {
    x: MARGIN_LEFT,
    y: y1,
    size: 9,
    font: fontItalic,
    color: darkGray,
  });
  const gehuCity = "Dehradun, Uttarakhand";
  page1.drawText(gehuCity, {
    x: PAGE_WIDTH - MARGIN_RIGHT - fontItalic.widthOfTextAtSize(gehuCity, 9),
    y: y1,
    size: 9,
    font: fontItalic,
    color: darkGray,
  });
  y1 -= 15;

  // Doon International School
  page1.drawText("Doon International School", { x: MARGIN_LEFT, y: y1, size: 9.5, font: fontBold, color: black });
  const disDate = "2024";
  page1.drawText(disDate, {
    x: PAGE_WIDTH - MARGIN_RIGHT - fontBold.widthOfTextAtSize(disDate, 9.5),
    y: y1,
    size: 9.5,
    font: fontBold,
    color: black,
  });
  y1 -= 11.5;

  page1.drawText("Senior Secondary Education (CBSE)", {
    x: MARGIN_LEFT,
    y: y1,
    size: 9,
    font: fontItalic,
    color: darkGray,
  });
  page1.drawText(gehuCity, {
    x: PAGE_WIDTH - MARGIN_RIGHT - fontItalic.widthOfTextAtSize(gehuCity, 9),
    y: y1,
    size: 9,
    font: fontItalic,
    color: darkGray,
  });
  y1 -= 15;

  // Summer Valley School
  page1.drawText("Summer Valley School", { x: MARGIN_LEFT, y: y1, size: 9.5, font: fontBold, color: black });
  const svsDate = "2022";
  page1.drawText(svsDate, {
    x: PAGE_WIDTH - MARGIN_RIGHT - fontBold.widthOfTextAtSize(svsDate, 9.5),
    y: y1,
    size: 9.5,
    font: fontBold,
    color: black,
  });
  y1 -= 11.5;

  page1.drawText("Secondary Education (ICSE)", {
    x: MARGIN_LEFT,
    y: y1,
    size: 9,
    font: fontItalic,
    color: darkGray,
  });
  page1.drawText(gehuCity, {
    x: PAGE_WIDTH - MARGIN_RIGHT - fontItalic.widthOfTextAtSize(gehuCity, 9),
    y: y1,
    size: 9,
    font: fontItalic,
    color: darkGray,
  });
  y1 -= 20;

  // --- PROJECTS ---
  y1 = drawSectionHeader(page1, "Projects", y1);

  // 1. GEHU Connect
  page1.drawText("GEHU Connect – Student Community & Networking Platform", {
    x: MARGIN_LEFT,
    y: y1,
    size: 9.5,
    font: fontBold,
    color: black,
  });
  page1.drawText("2026", {
    x: PAGE_WIDTH - MARGIN_RIGHT - fontBold.widthOfTextAtSize("2026", 9.5),
    y: y1,
    size: 9.5,
    font: fontBold,
    color: black,
  });
  y1 -= 11;

  page1.drawText("Java, Spring Boot, React Native, Expo, Cloudflare R2, AWS SDK", {
    x: MARGIN_LEFT,
    y: y1,
    size: 9,
    font: fontItalic,
    color: darkGray,
  });
  y1 -= 12;

  y1 = drawBullet(page1, "Engineered a full-stack university networking platform enabling student communication, community interaction, and centralized campus engagement.", y1);
  y1 = drawBullet(page1, "Designed and developed scalable REST APIs using Spring Boot and built a cross-platform mobile application using React Native and Expo.", y1);
  y1 = drawBullet(page1, "Implemented cloud-based media storage and optimized file handling workflows using Cloudflare R2 and AWS SDK integrations.", y1);
  y1 = drawBullet(page1, "Focused on modular backend architecture, scalable data flow, and production-oriented mobile application development practices.", y1);
  y1 -= 6;

  // 2. OmniMentor
  page1.drawText("OmniMentor – Anticipatory AI Classroom OS", {
    x: MARGIN_LEFT,
    y: y1,
    size: 9.5,
    font: fontBold,
    color: black,
  });
  const omniStack = " | Next.js, React.js, Node.js, Python, AI APIs";
  const title1Width = fontBold.widthOfTextAtSize("OmniMentor – Anticipatory AI Classroom OS", 9.5);
  page1.drawText(omniStack, {
    x: MARGIN_LEFT + title1Width,
    y: y1,
    size: 9,
    font: fontItalic,
    color: darkGray,
  });
  page1.drawText("2026", {
    x: PAGE_WIDTH - MARGIN_RIGHT - fontBold.widthOfTextAtSize("2026", 9.5),
    y: y1,
    size: 9.5,
    font: fontBold,
    color: black,
  });
  y1 -= 12;

  y1 = drawBullet(page1, "Developed an AI-powered adaptive learning platform capable of predicting learner doubts and dynamically personalizing educational workflows.", y1);
  y1 = drawBullet(page1, "Built intelligent context-aware systems integrating AI APIs for automated explanation generation, learning assistance, and real-time interaction.", y1);
  y1 = drawBullet(page1, "Architected modular AI components including OmniProfile, OmniPredict, OmniLoop, and OmniFlow for scalable adaptive classroom experiences.", y1);
  y1 = drawBullet(page1, "Integrated frontend, backend, and AI orchestration pipelines to simulate production-grade intelligent educational systems.", y1);
  y1 -= 6;

  // 3. AutoHire
  page1.drawText("AutoHire – AI-Powered Hiring Platform", {
    x: MARGIN_LEFT,
    y: y1,
    size: 9.5,
    font: fontBold,
    color: black,
  });
  const autoStack = " | Node.js, Kafka, Zookeeper, MongoDB";
  const title2Width = fontBold.widthOfTextAtSize("AutoHire – AI-Powered Hiring Platform", 9.5);
  page1.drawText(autoStack, {
    x: MARGIN_LEFT + title2Width,
    y: y1,
    size: 9,
    font: fontItalic,
    color: darkGray,
  });
  page1.drawText("2025", {
    x: PAGE_WIDTH - MARGIN_RIGHT - fontBold.widthOfTextAtSize("2025", 9.5),
    y: y1,
    size: 9.5,
    font: fontBold,
    color: black,
  });
  y1 -= 12;

  y1 = drawBullet(page1, "Built an event-driven recruitment platform to automate candidate workflow management and reduce manual hiring coordination overhead.", y1);
  y1 = drawBullet(page1, "Implemented distributed asynchronous communication pipelines using Apache Kafka and Zookeeper for scalable backend event processing.", y1);
  y1 = drawBullet(page1, "Designed backend services for candidate tracking, workflow orchestration, and real-time recruitment pipeline management.", y1);
  y1 = drawBullet(page1, "Worked with distributed system concepts, scalable messaging infrastructure, and production-style backend architecture patterns.", y1);
  y1 -= 8;

  // --- TECHNICAL SKILLS ---
  y1 = drawSectionHeader(page1, "Technical Skills", y1);

  const skills = [
    { label: "Languages", value: "Java, Python, JavaScript, SQL, HTML/CSS" },
    { label: "Frameworks & Technologies", value: "MERN Stack (MongoDB, Express.js, React.js, Node.js), Spring Boot, React Native, Next.js, Expo" },
    { label: "Databases", value: "MySQL, MongoDB" },
    { label: "Cloud & Dev Tools", value: "Git, GitHub, Kafka, Zookeeper, Cloudflare R2, AWS SDK, Postman, VS Code, Figma, Jupyter" },
    { label: "Core CS Concepts", value: "Data Structures & Algorithms, OOP, DBMS, Operating Systems, Computer Networks, REST APIs, System Design" },
  ];

  for (const s of skills) {
    page1.drawText(s.label + " : ", {
      x: MARGIN_LEFT,
      y: y1,
      size: 9,
      font: fontBold,
      color: black,
    });
    const labelW = fontBold.widthOfTextAtSize(s.label + " : ", 9);
    
    // Check wrapping if needed
    const valW = fontRegular.widthOfTextAtSize(s.value, 9);
    if (labelW + valW > CONTENT_WIDTH) {
      // Print on next line or split
      const words = s.value.split(" ");
      let line1 = "";
      let line2 = "";
      let onFirst = true;
      for (const w of words) {
        if (onFirst && fontRegular.widthOfTextAtSize((line1 ? line1 + " " : "") + w, 9) < (CONTENT_WIDTH - labelW)) {
          line1 = (line1 ? line1 + " " : "") + w;
        } else {
          onFirst = false;
          line2 = (line2 ? line2 + " " : "") + w;
        }
      }
      page1.drawText(line1, { x: MARGIN_LEFT + labelW, y: y1, size: 9, font: fontRegular, color: darkGray });
      y1 -= 11.5;
      page1.drawText(line2, { x: MARGIN_LEFT + 20, y: y1, size: 9, font: fontRegular, color: darkGray });
      y1 -= 12.5;
    } else {
      page1.drawText(s.value, { x: MARGIN_LEFT + labelW, y: y1, size: 9, font: fontRegular, color: darkGray });
      y1 -= 12.5;
    }
  }
  y1 -= 6;

  // --- CERTIFICATIONS & PROFESSIONAL DEVELOPMENT ---
  y1 = drawSectionHeader(page1, "Certifications & Professional Development", y1);
  y1 = drawBullet(page1, "Python Crash Course.", y1, 10);
  y1 = drawBullet(page1, "Introduction to Machine Learning.", y1, 10);
  y1 = drawBullet(page1, "Databases and SQL.", y1, 10);

  // ==========================================
  // PAGE 2
  // ==========================================
  const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y2 = PAGE_HEIGHT - 54;

  y2 = drawSectionHeader(page2, "Achievements & Extra Curriculars", y2);

  // 1. Director General, Graphic Era MUN Club
  page2.drawText("Director General, Graphic Era MUN Club", {
    x: MARGIN_LEFT,
    y: y2,
    size: 10,
    font: fontBold,
    color: black,
  });
  page2.drawText("2025", {
    x: PAGE_WIDTH - MARGIN_RIGHT - fontBold.widthOfTextAtSize("2025", 10),
    y: y2,
    size: 10,
    font: fontBold,
    color: black,
  });
  y2 -= 13;
  y2 = drawBullet(page2, "Leading and managing university-level MUN operations including committee planning, delegate management, event execution, and inter-team coordination.", y2);
  y2 -= 8;

  // 2. Host & Organizer
  page2.drawText("Host & Organizer, University Model United Nations Conferences", {
    x: MARGIN_LEFT,
    y: y2,
    size: 10,
    font: fontBold,
    color: black,
  });
  const confDate = "2025 – 2026";
  page2.drawText(confDate, {
    x: PAGE_WIDTH - MARGIN_RIGHT - fontBold.widthOfTextAtSize(confDate, 10),
    y: y2,
    size: 10,
    font: fontBold,
    color: black,
  });
  y2 -= 13;
  y2 = drawBullet(page2, "Successfully organized and hosted multiple Model United Nations conferences, overseeing event logistics, committee operations, and participant engagement.", y2);
  y2 -= 8;

  // 3. MUN Outreach & Public Speaking
  page2.drawText("MUN Outreach & Public Speaking Initiatives", {
    x: MARGIN_LEFT,
    y: y2,
    size: 10,
    font: fontBold,
    color: black,
  });
  page2.drawText("2025", {
    x: PAGE_WIDTH - MARGIN_RIGHT - fontBold.widthOfTextAtSize("2025", 10),
    y: y2,
    size: 10,
    font: fontBold,
    color: black,
  });
  y2 -= 13;
  y2 = drawBullet(page2, "Conducted MUN seminars, mock sessions, and promotional workshops across 15+ schools in Dehradun, helping increase student participation and awareness about competitive debating and diplomacy.", y2);
  y2 -= 8;

  // 4. Delegate Experience
  page2.drawText("Delegate Experience – International Relations & Debate", {
    x: MARGIN_LEFT,
    y: y2,
    size: 10,
    font: fontBold,
    color: black,
  });
  const delDate = "2024 – Present";
  page2.drawText(delDate, {
    x: PAGE_WIDTH - MARGIN_RIGHT - fontBold.widthOfTextAtSize(delDate, 10),
    y: y2,
    size: 10,
    font: fontBold,
    color: black,
  });
  y2 -= 13;
  y2 = drawBullet(page2, "Represented countries including Pakistan, Switzerland, and Mexico across committees such as UNGA DISEC and IOC, strengthening skills in public speaking, negotiation, research, and leadership.", y2);

  // Write out to public/parth_resume.pdf
  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, '..', 'public', 'parth_resume.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log("Successfully generated:", outputPath, "Bytes:", pdfBytes.length);
}

createResume().catch(err => {
  console.error("PDF generation error:", err);
  process.exit(1);
});
