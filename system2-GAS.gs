/**
 * สร้าง Google Form (GGF) สำหรับรับฟีดแบ็กจากลูกค้า
 * โครงสร้างคำถามอ้างอิงจาก 'แบบสอบถามความพึงพอใจและข้อเสนอแนะ'
 * โค้ดนี้จะสร้างฟอร์มใหม่เท่านั้น และไม่เชื่อมโยงกับ Google Sheet โดยอัตโนมัติ
 * ผู้ใช้สามารถเชื่อมโยงปลายทาง (GGS) ภายหลังได้เอง
 */
function createFeedbackForm() {
  // ไม่ต้องตรวจสอบว่าโค้ดถูกรันจาก Google Sheet หรือไม่ เนื่องจากเราจะไม่เชื่อมต่อกับ Sheet โดยตรง
  
  // กำหนดรายละเอียดฟอร์ม
  const formTitle = "แบบสอบถามความพึงพอใจและข้อเสนอแนะ";
  const formDescription = "ขอบคุณที่สละเวลาให้ข้อเสนอแนะอันมีค่าแก่เรา ข้อมูลของท่านจะถูกนำไปใช้วิเคราะห์เพื่อปรับปรุงสินค้าและบริการให้ดียิ่งขึ้นไป";

  // สร้างฟอร์มใหม่ (FormApp.create จะสร้างฟอร์มเปล่าที่ไม่เชื่อมกับ Sheet)
  const form = FormApp.create(formTitle);
  form.setDescription(formDescription);
  
  // *** ลบส่วน form.setDestination ออกตามความต้องการของคุณ ***

  // === ส่วนที่ 1: คะแนนความพึงพอใจ (Critical Score) ===
  
  // 1. ท่านให้คะแนนความพึงพอใจโดยรวมเท่าไร? (Scale 1 - 5)
  const scoreQuestion = form.addListItem();
  scoreQuestion.setTitle("ท่านให้คะแนนความพึงพอใจโดยรวมเท่าไร?");
  scoreQuestion.setHelpText("(Scale 1 - 5: 1 = ไม่พอใจมากที่สุด, 5 = พอใจมากที่สุด)");
  scoreQuestion.setRequired(true);

  // สร้างตัวเลือก (Items) สำหรับคะแนน 1 ถึง 5
  const scoreChoices = [
    scoreQuestion.createChoice("1: ไม่พอใจมากที่สุด"),
    scoreQuestion.createChoice("2: ไม่พอใจ"),
    scoreQuestion.createChoice("3: ปานกลาง"),
    scoreQuestion.createChoice("4: พอใจ"),
    scoreQuestion.createChoice("5: พอใจมากที่สุด")
  ];
  scoreQuestion.setChoices(scoreChoices);

  // === ส่วนที่ 2: ข้อเสนอแนะ (AI Analysis Input) ===

  // 2. โปรดระบุความคิดเห็น/ข้อเสนอแนะของท่าน (ไม่จำกัดจำนวน)
  const feedbackQuestion = form.addParagraphTextItem();
  feedbackQuestion.setTitle("โปรดระบุความคิดเห็น/ข้อเสนอแนะของท่าน (ไม่จำกัดจำนวน)");
  feedbackQuestion.setHelpText("โปรดพิมพ์ข้อความที่ละเอียดที่สุดเท่าที่จะเป็นไปได้ เช่น ปัญหาที่พบ หรือสิ่งที่ท่านประทับใจ");
  feedbackQuestion.setRequired(true);

  // === ส่วนที่ 3: ข้อมูลเพิ่มเติม ===

  // 3. ท่านได้รับบริการ/สินค้าจากสาขา/ทีมงานใด?
  const branchQuestion = form.addListItem();
  branchQuestion.setTitle("ท่านได้รับบริการ/สินค้าจากสาขา/ทีมงานใด?");
  branchQuestion.setRequired(false);
  
  // ตัวเลือกตัวอย่าง
  const branchChoices = [
    branchQuestion.createChoice("สาขา A"),
    branchQuestion.createChoice("ทีมบริการลูกค้าออนไลน์"),
    branchQuestion.createChoice("สาขา B"),
    branchQuestion.createChoice("อื่นๆ (โปรดระบุในช่องความคิดเห็น)")
  ];
  branchQuestion.setChoices(branchChoices);

  // 4. ช่องทางติดต่อกลับ
  const contactQuestion = form.addTextItem();
  contactQuestion.setTitle("ช่องทางติดต่อกลับ (ถ้าต้องการให้เราติดต่อเพื่อสอบถามรายละเอียดเพิ่มเติม)");
  contactQuestion.setHelpText("เช่น เบอร์โทรศัพท์ หรือ Email");
  contactQuestion.setRequired(false);
  
  // แสดง URL ของฟอร์มที่สร้างขึ้น
  const formUrl = form.getPublishedUrl();
  Logger.log('Google Form URL: ' + formUrl);
  Logger.log('สร้าง Google Form ใหม่เรียบร้อยแล้ว: ' + formUrl);
  
  // หากโค้ดทำงานได้ Form จะถูกสร้างเรียบร้อยแล้ว
}

/**
 * ฟังก์ชันสำหรับเปิด URL ของฟอร์มที่ถูกสร้างล่าสุดใน Pop-up
 * เพื่อความสะดวกในการเข้าถึง GGF
 */
function openFormUrl() {
  const forms = FormApp.getForms();
  const ui = SpreadsheetApp.getUi(); // รับ UI ของ Google Sheet

  if (forms.length > 0) {
    const formUrl = forms[0].getPublishedUrl();
    if (formUrl) {
      // ใช้ HTML Service เพื่อเปิดลิงก์ในหน้าต่างใหม่
      var html = HtmlService.createHtmlOutput('<script>window.open("' + formUrl + '");</script>').setWidth(10).setHeight(10);
      ui.showModalDialog(html, 'เปิด Google Form');
    }
  } else {
    // ใช้ ui.alert ได้ที่นี่ เพราะฟังก์ชันนี้ถูกออกแบบให้รันผ่าน UI
    ui.alert("ไม่พบฟอร์ม", "กรุณาสร้างฟอร์มก่อนโดยรันฟังก์ชัน createFeedbackForm()", ui.ButtonSet.OK);
  }
}

/**
 * ฟังก์ชันสำหรับแสดงลิงก์ GGF ที่ถูกสร้างล่าสุดใน Pop-up
 */
function showFormLink() {
  const forms = FormApp.getForms();
  const ui = SpreadsheetApp.getUi(); // รับ UI ของ Google Sheet

  if (forms.length > 0) {
    const formUrl = forms[0].getPublishedUrl();
    if (formUrl) {
      // สร้างเนื้อหา HTML สำหรับแสดงลิงก์ที่คลิกได้
      const htmlContent = `
        <p>ลิงก์ GGF ที่สร้างล่าสุด:</p>
        <a href="${formUrl}" target="_blank" style="color: blue; text-decoration: underline;">${formUrl}</a>
        <br><br>
        <button onclick="google.script.host.close()">ปิด</button>
      `;
      const html = HtmlService.createHtmlOutput(htmlContent)
        .setWidth(600)
        .setHeight(150);
      ui.showModalDialog(html, 'ลิงก์ Google Form');
    }
  } else {
    ui.alert("ไม่พบฟอร์ม", "กรุณารัน createFeedbackForm() ก่อนเพื่อสร้าง GGF", ui.ButtonSet.OK);
  }
}