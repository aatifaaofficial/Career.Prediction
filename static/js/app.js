/**
 * app.js
 * -------
 * Complete client-side logic for the Sleep Disturbance Analyzer.
 * Handles: Patient Registration step, 20-question navigation,
 * validation, API submission, and Official Certificate PDF Generation.
 */

/* ═══════════════════════════════════════════════════════════════
   QUESTION BANK
   (option index: 0 = Insomnia-aligned,
                  1 = Sleep Apnea-aligned,
                  2 = Hypersomnia/Circadian-aligned)
   ═══════════════════════════════════════════════════════════════ */
const QUESTIONS_EN = [
  {
    id: 1,
    text: "How long does it typically take you to fall asleep after getting into bed?",
    options: [
      "More than 30–60 minutes — my mind keeps racing",
      "I fall asleep quickly but wake up gasping or snoring",
      "I fall asleep almost instantly, often unintentionally"
    ]
  },
  {
    id: 2,
    text: "How would you describe your sleep duration on a typical night?",
    options: [
      "Less than 6 hours — I just can't stay asleep long enough",
      "6–8 hours, but I feel completely unrefreshed in the morning",
      "9 hours or more, yet I still feel exhausted all day"
    ]
  },
  {
    id: 3,
    text: "Do you or a bed partner notice any of the following during your sleep?",
    options: [
      "Frequent tossing and turning, restlessness, or talking in sleep",
      "Loud snoring, choking sounds, or visibly pausing breathing",
      "Very deep, motionless sleep that's impossible to wake from"
    ]
  },
  {
    id: 4,
    text: "How do you feel when you first wake up in the morning?",
    options: [
      "Alert but frustrated — I've been awake for hours already",
      "Extremely groggy, with a dry mouth or headache",
      "Like I could sleep another 4–5 hours no matter what time it is"
    ]
  },
  {
    id: 5,
    text: "How often do you experience uncontrollable daytime sleepiness?",
    options: [
      "Rarely — I'm tired but can usually stay awake during the day",
      "Occasionally — especially after meals or in warm environments",
      "Very often — I fall asleep during meetings, reading, or driving"
    ]
  },
  {
    id: 6,
    text: "What is your typical sleep schedule?",
    options: [
      "I go to bed at a regular time but can't sleep for hours",
      "I try to sleep early but wake up frequently during the night",
      "I naturally stay up past 2–3 AM and wake up in the afternoon"
    ]
  },
  {
    id: 7,
    text: "What kinds of thoughts or sensations occur as you try to fall asleep?",
    options: [
      "Racing thoughts, worry, anxiety, or an inability to 'switch off'",
      "I feel discomfort or tingling in my legs (restless legs)",
      "I feel completely sleepy but also feel disoriented about time"
    ]
  },
  {
    id: 8,
    text: "How does your sleep problem affect your energy and mood during the day?",
    options: [
      "I'm irritable, anxious, and have difficulty concentrating",
      "I feel physically fatigued and have recurring morning headaches",
      "I feel mentally foggy and sluggish, like I'm in a fog all day"
    ]
  },
  {
    id: 9,
    text: "Do you rely on any of the following to manage your sleep?",
    options: [
      "Sleep medication, herbal supplements, or alcohol to fall asleep",
      "Positional aids (anti-snore pillow, CPAP), or sleeping propped up",
      "Multiple alarms, blackout curtains, or napping several times a day"
    ]
  },
  {
    id: 10,
    text: "How often do you wake up during the night?",
    options: [
      "2–4+ times per night, and I struggle to fall back asleep",
      "I often wake up suddenly, gasping or heart racing",
      "Rarely — once I'm asleep, almost nothing can wake me up"
    ]
  },
  {
    id: 11,
    text: "Do you feel anxious or worried about sleep itself?",
    options: [
      "Yes — I dread bedtime because I know I won't be able to sleep",
      "Sometimes — I'm more worried about waking up exhausted",
      "No — I actually look forward to sleep and could sleep anywhere"
    ]
  },
  {
    id: 12,
    text: "What is your body weight and physical profile like?",
    options: [
      "Average or lean build with no significant weight concerns",
      "Overweight or have a large neck — others say I snore loudly",
      "Any build, but I feel physically lethargic most of the day"
    ]
  },
  {
    id: 13,
    text: "When are you most mentally alert and productive?",
    options: [
      "In the morning — though I'm exhausted from poor night sleep",
      "Midday — mornings are rough due to fatigue",
      "Late at night — I feel most awake after midnight"
    ]
  },
  {
    id: 14,
    text: "How does your sleep problem affect your social and work life?",
    options: [
      "I avoid social events because of fatigue and irritability",
      "I've had workplace incidents due to extreme drowsiness",
      "I miss morning commitments regularly due to being unable to wake"
    ]
  },
  {
    id: 15,
    text: "How long have you been experiencing significant sleep problems?",
    options: [
      "Several months to years — it's been ongoing and persistent",
      "On and off, often worse when I gain weight or am congested",
      "Most of my life — I've always been a 'night owl' or heavy sleeper"
    ]
  },
  {
    id: 16,
    text: "Which physical symptom have you experienced most often?",
    options: [
      "Headaches from lack of sleep, eye fatigue, muscle tension",
      "Waking with a sore throat, dry mouth, or morning headaches",
      "Heavy, leaden feeling in limbs, cognitive slowness all day"
    ]
  },
  {
    id: 17,
    text: "What typically happens when you try to take a daytime nap?",
    options: [
      "I can't nap even when tired — my mind stays active",
      "I nap occasionally but still feel unrested afterwards",
      "I nap for 2–3 hours easily and feel I could sleep even more"
    ]
  },
  {
    id: 18,
    text: "How does caffeine (coffee, tea, energy drinks) affect you?",
    options: [
      "I drink it to cope with tiredness but it makes night sleep worse",
      "I need it to function but it doesn't fully solve my fatigue",
      "Even heavy caffeine use barely keeps me awake during the day"
    ]
  },
  {
    id: 19,
    text: "Have you been told by a doctor or partner to seek help for sleep?",
    options: [
      "Yes — they say I look tired all the time and am irritable",
      "Yes — they're worried about my snoring or breathing at night",
      "Yes — they're concerned about how much I sleep or daytime napping"
    ]
  },
  {
    id: 20,
    text: "Which statement best describes your overall relationship with sleep?",
    options: [
      "I desperately want to sleep but my body and mind won't let me",
      "I sleep but wake feeling like I barely rested at all",
      "I could sleep at any time, in any place — sleep is never enough"
    ]
  }
];

const QUESTIONS_BN = [
  {
    id: 1,
    text: "বিছানায় শোয়ার পর আপনার ঘুমাতে সাধারণত কত সময় লাগে?",
    options: [
      "৩০–৬০ মিনিটের বেশি — মাথায় নানা চিন্তা ঘুরতে থাকে",
      "দ্রুত ঘুমিয়ে পড়ি কিন্তু হুট করে শ্বাসকষ্ট বা নাক ডাকার সাথে ঘুম ভাঙে",
      "বিছানায় শোয়ার সাথে সাথেই প্রায় অনিচ্ছাকৃতভাবে ঘুমিয়ে পড়ি"
    ]
  },
  {
    id: 2,
    text: "সাধারণ রাতে আপনার ঘুমের সময়কাল কেমন হয়?",
    options: [
      "৬ ঘণ্টার কম — বেশি সময় ধরে ঘুমিয়ে থাকতে পারি না",
      "৬–৮ ঘণ্টা ঘুমাই, কিন্তু সকালে উঠেও ক্লান্ত লাগে",
      "৯ ঘণ্টা বা তার বেশি ঘুমাই, তবুও সারাদিন ক্লান্ত বোধ করি"
    ]
  },
  {
    id: 3,
    text: "ঘুমের সময় আপনার বা সঙ্গীর চোখে নিচের কোন লক্ষণটি পড়ে?",
    options: [
      "বারবার এপাশ-ওপাশ করা, অস্থিরতা বা ঘুমের ঘোরে কথা বলা",
      "বিকট শব্দে নাক ডাকা, শ্বাসনালী আটকে আসা বা দম বন্ধ হওয়া",
      "খুব গভীর, নিথর ঘুম যা থেকে ওঠানো প্রায় অসম্ভব"
    ]
  },
  {
    id: 4,
    text: "সকালে ঘুম থেকে ওঠার পর আপনার অনুভূতি কেমন হয়?",
    options: [
      "সচেতন কিন্তু হতাশ — অনেক আগেই ঘুম ভেঙে জেগে বসে আছি",
      "প্রচণ্ড ঝিমুনি ভাব, মুখ শুকিয়ে থাকা বা মাথাব্যথা",
      "মনে হয় যেন আরও ৪–৫ ঘণ্টা ঘুমাতে পারলে ভালো হতো"
    ]
  },
  {
    id: 5,
    text: "দিনে অনিয়ন্ত্রিতভাবে ঘুম আসার প্রবণতা কত প্রায়ই হয়?",
    options: [
      "খুব কম — ক্লান্ত লাগলেও সারাদিন জেগে থাকতে পারি",
      "মাঝে মাঝে — বিশেষ করে খাবার খাওয়ার পর বা গরম পরিবেশে",
      "প্রায়ই — মিটিংয়ে, বই পড়ার সময় বা গাড়ি চালানোর সময়ও ঘুম চলে আসে"
    ]
  },
  {
    id: 6,
    text: "আপনার সাধারণ ঘুমের সময়সূচী কেমন?",
    options: [
      "নির্দিষ্ট সময়ে ঘুমাতে যাই কিন্তু ঘণ্টার পর ঘণ্টা ঘুম আসে না",
      "তাড়াতাড়ি ঘুমানোর চেষ্টা করি কিন্তু রাতে বারবার ঘুম ভেঙে যায়",
      "রাত ২–৩ টার আগে ঘুম আসে না এবং দুপুরে ঘুম থেকে উঠি"
    ]
  },
  {
    id: 7,
    text: "ঘুমানোর চেষ্টা করার সময় কেমন অনুভূতি বা চিন্তা মনে আসে?",
    options: [
      "মাথায় চিন্তার ঝড়, দুশ্চিন্তা, উদ্বেগ বা মন শান্ত করতে না পারা",
      "পায়ে অস্বস্তি বা ঝিঁঝিঁ ধরার অনুভূতি (রেস্টলেস লেগস)",
      "প্রচণ্ড ঘুম পায় কিন্তু সময়ের হিসাব এলোমেলো লাগে"
    ]
  },
  {
    id: 8,
    text: "ঘুমের সমস্যা দিনে আপনার শক্তি ও মেজাজে কেমন প্রভাব ফেলে?",
    options: [
      "মেজাজ খিটখিটে হয়, উদ্বেগ বা কাজে মনোযোগের অভাব হয়",
      "শারীরিকভাবে প্রচণ্ড ক্লান্তি ও সকালে বারবার মাথাব্যথা হয়",
      "মানসিকভাবে অলস ও অস্পষ্ট লাগে, সারাদিন ধোঁয়াশাচ্ছন্ন অনুভূতি হয়"
    ]
  },
  {
    id: 9,
    text: "ঘুম নিয়ন্ত্রণের জন্য আপনি নিচের কোনটির ওপর নির্ভর করেন?",
    options: [
      "ঘুমের ওষুধ, হার্বাল সাপ্লিমেন্ট বা অ্যালকোহল",
      "নাক ডাকা বিরোধী বালিশ, CPAP মেশিন বা হেলান দিয়ে শোয়া",
      "একাধিক অ্যালার্ম, কালো পর্দা বা দিনে একাধিকবার ঘুমানো"
    ]
  },
  {
    id: 10,
    text: "রাতে আপনার কতবার ঘুম ভেঙে যায়?",
    options: [
      "রাতে ২–৪ বার বা তার বেশি ভেঙে যায় এবং পুনরায় ঘুমানো কঠিন হয়",
      "হঠাৎ হাঁপাতে হাঁপাতে বা বুক ধড়ফড় করে ঘুম ভেঙে যায়",
      "খুব কম — একবার ঘুমালে সহজে ঘুম ভাঙে না"
    ]
  },
  {
    id: 11,
    text: "ঘুম নিয়ে কি আপনি নিজে উদ্বিগ্ন বা চিন্তিত বোধ করেন?",
    options: [
      "হ্যাঁ — শোয়ার সময় হলে ভয় লাগে কারণ জানি ঘুম আসবে না",
      "মাঝে মাঝে — সকালে উঠে ক্লান্ত লাগার চিন্তায় থাকি",
      "না — আমি ঘুমের জন্য মুখিয়ে থাকি এবং যে কোনো জায়গায় ঘুমাতে পারি"
    ]
  },
  {
    id: 12,
    text: "আপনার শারীরিক গঠন ও ওজন কেমন?",
    options: [
      "স্বাভাবিক বা হালকা গড়ন, ওজন নিয়ে কোনো বিশেষ চিন্তা নেই",
      "অতিরিক্ত ওজন বা মোটা ঘাড় — অন্যরা বলে আমি জোরে নাক ডাকি",
      "যেকোনো গড়ন, তবে সারাদিন শারীরিকভাবে নিস্তেজ লাগে"
    ]
  },
  {
    id: 13,
    text: "দিনের কোন সময়ে আপনি সবচেয়ে বেশি মানসিক চাঙ্গা ও কর্মক্ষম থাকেন?",
    options: [
      "সকালে — যদিও রাতের বাজে ঘুমের কারণে ক্লান্ত থাকি",
      "দুপুরের দিকে — সকালে ক্লান্তির কারণে কাজ করা কঠিন হয়",
      "গভীর রাতে — মাঝরাতের পর সবচেয়ে বেশি জাগ্রত বোধ করি"
    ]
  },
  {
    id: 14,
    text: "ঘুমের সমস্যা আপনার সামাজিক ও কর্মজীবনে কেমন প্রভাব ফেলে?",
    options: [
      "ক্লান্তি ও খিটখিটে মেজাজের কারণে সামাজিক অনুষ্ঠান এড়িয়ে চলি",
      "প্রচণ্ড ঝিমুনির কারণে কর্মক্ষেত্রে সমস্যা হয়েছে",
      "সকালে উঠতে না পারার কারণে নিয়মিত সকালের কাজ মিস হয়"
    ]
  },
  {
    id: 15,
    text: "কতদিন ধরে আপনি গুরুতর ঘুমের সমস্যা অনুভব করছেন?",
    options: [
      "কয়েক মাস থেকে কয়েক বছর ধরে — এটি ক্রমাগত চলছে",
      "মাঝে মাঝে হয় — ওজন বাড়লে বা সর্দি হলে বাড়ে",
      "জীবনের অধিকাংশ সময় — আমি সবসময়ই রাতজাগা বা গভীর ঘুমকাতুরে"
    ]
  },
  {
    id: 16,
    text: "কোন শারীরিক উপসর্গটি আপনি সবচেয়ে বেশি অনুভব করেছেন?",
    options: [
      "ঘুমের অভাবে মাথাব্যথা, চোখের ক্লান্তি, মাংসপেশিতে টান",
      "গলা শুকিয়ে ঘুম থেকে ওঠা, মুখের শুষ্কতা বা সকালে মাথাব্যথা",
      "হাত-পায়ে ভারী ভাব, সারাদিন মানসিক ধীরগতি"
    ]
  },
  {
    id: 17,
    text: "দিনে ঘুমানোর চেষ্টা করলে সাধারণত কী ঘটে?",
    options: [
      "ক্লান্ত থাকলেও ঘুমাতে পারি না — মন সচল থাকে",
      "মাঝে মাঝে ঘুমাই কিন্তু তারপরও সতেজ লাগে না",
      "সহজেই ২–৩ ঘণ্টা ঘুমিয়ে পড়ি এবং আরও ঘুমাতে ইচ্ছা করে"
    ]
  },
  {
    id: 18,
    text: "ক্যাফেইন (চা, কফি, এনার্জি ড্রিংক) আপনার ওপর কেমন প্রভাব ফেলে?",
    options: [
      "ক্লান্তি কাটাতে খাই কিন্তু এতে রাতের ঘুম আরও বাজে হয়",
      "কাজ করার জন্য দরকার হয় কিন্তু পুরোপুরি ক্লান্তি দূর হয় না",
      "প্রচুর ক্যাফেইন খেলেও সারাদিন জেগে থাকা কঠিন হয়"
    ]
  },
  {
    id: 19,
    text: "কোনো ডাক্তার বা সঙ্গী কি আপনাকে ঘুমের জন্য পরামর্শ নিতে বলেছেন?",
    options: [
      "হ্যাঁ — তারা বলে আমাকে সব সময় ক্লান্ত ও খিটখিটে দেখায়",
      "হ্যাঁ — তারা রাতে আমার নাক ডাকা বা শ্বাস বন্ধ হওয়া নিয়ে চিন্তিত",
      "হ্যাঁ — তারা আমার অতিরিক্ত ঘুম বা দিনের বেলা ঘুমানো নিয়ে চিন্তিত"
    ]
  },
  {
    id: 20,
    text: "কোন বাক্যটি ঘুমের সাথে আপনার সম্পর্ক সবচেয়ে ভালোভাবে প্রকাশ করে?",
    options: [
      "আমি ব্যাকুলভাবে ঘুমাতে চাই কিন্তু আমার শরীর ও মন দেয় না",
      "আমি ঘুমাই কিন্তু ঘুম থেকে ওঠার পর মনে হয় বিন্দুমাত্র বিশ্রাম হয়নি",
      "আমি যেকোনো সময়, যেকোনো স্থানে ঘুমাতে পারি — ঘুম কখনোই যথেষ্ট নয়"
    ]
  }
];

/* Default language state */
let currentLang = localStorage.getItem("sleepai_lang") || "en";
let QUESTIONS = currentLang === "bn" ? QUESTIONS_BN : QUESTIONS_EN;

/* UI Language Translations Dictionary */
const I18N = {
  en: {
    heroTitleLine: "Sleep Disturbance",
    heroTitleGrad: "Analyzer",
    heroSubtitle: "Advanced AI-powered sleep pattern recognition system.<br />Get personalized clinical insights and a digital screening certificate.",
    btnStart: "Start Free Assessment",
    navBadge: "Medical Screening",
    step1Title: "Patient Profile",
    step1Sub: "Enter your details for accurate clinical analysis and certificate generation.",
    lblFullName: "Full Name",
    lblAge: "Age",
    lblGender: "Gender",
    btnBeginQuiz: "Begin 20 Questions",
    btnBack: "Back",
    btnPrev: "Previous",
    btnNext: "Next",
    btnSubmit: "Submit & Generate Certificate",
    qPrefix: "Question",
    ofWord: "of",
    validationErr: "⚠️ Please select an answer to continue.",
  },
  bn: {
    heroTitleLine: "ঘুমের সমস্যা",
    heroTitleGrad: "বিশ্লেষক AI",
    heroSubtitle: "কৃত্রিম বুদ্ধিমত্তা ভিত্তিক উন্নত স্লিপ প্যাটার্ন বিশ্লেষণ ব্যবস্থা।<br />আপনার ব্যক্তিগত স্বাস্থ্য বিবরণী ও ডিজিটাল স্ক্রিনিং সার্টিফিকেট পান।",
    btnStart: "বিনামূল্যে পরীক্ষা শুরু করুন",
    navBadge: "চিকিৎসা স্ক্রিনিং",
    step1Title: "রোগীর বিবরণী",
    step1Sub: "সঠিক ক্লিনিকাল বিশ্লেষণ ও সনদের জন্য আপনার তথ্য দিন।",
    lblFullName: "পূর্ণ নাম",
    lblAge: "বয়স",
    lblGender: "লিঙ্গ",
    btnBeginQuiz: "২০টি প্রশ্ন শুরু করুন",
    btnBack: "পিছনে",
    btnPrev: "পূর্ববর্তী",
    btnNext: "পরবর্তী",
    btnSubmit: "জমা দিন ও সার্টিফিকেট তৈরি করুন",
    qPrefix: "প্রশ্ন",
    ofWord: "এর মধ্যে",
    validationErr: "⚠️ চালিয়ে যেতে একটি উত্তর নির্বাচন করুন।",
  }
};

/* Language Switcher Logic */
function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("sleepai_lang", lang);
  QUESTIONS = (lang === "bn") ? QUESTIONS_BN : QUESTIONS_EN;

  // Toggle active class on buttons
  const enBtn = document.getElementById("langEnBtn");
  const bnBtn = document.getElementById("langBnBtn");
  if (enBtn) enBtn.classList.toggle("active", lang === "en");
  if (bnBtn) bnBtn.classList.toggle("active", lang === "bn");

  // Toggle body font class
  document.body.classList.toggle("lang-bn", lang === "bn");

  // Update dynamic UI texts if present
  applyLanguageToUI();
}

function applyLanguageToUI() {
  const dict = I18N[currentLang];
  if (!dict) return;

  const navBadgeText = document.getElementById("navBadgeText");
  if (navBadgeText) {
    navBadgeText.innerHTML = `<span class="badge-dot"></span> ${dict.navBadge}`;
  }

  // Update Question rendering if quiz is active
  const quizSec = document.getElementById("quizSection");
  if (quizSec && !quizSec.classList.contains("hidden")) {
    renderQuestion(currentIndex);
  }
}

/* ═══════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════ */
let currentIndex = 0;            // 0-based index into QUESTIONS
const answers   = {};            // { Q1: 0|1|2, Q2: ..., ... }
let patientProfile = {
  userName: "",
  age: "",
  gender: ""
};

/* ═══════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  buildProgressDots();
  switchLanguage(currentLang);
});

/* ═══════════════════════════════════════════════════════════════
   HERO → USER INFO STEP
   ═══════════════════════════════════════════════════════════════ */
function showUserInfoStep() {
  const hero = document.getElementById("hero");
  const infoSec = document.getElementById("userInfoSection");
  if (!hero || !infoSec) return;

  hero.style.transition = "opacity 0.4s ease, transform 0.4s ease";
  hero.style.opacity = "0";
  hero.style.transform = "translateY(-20px)";

  setTimeout(() => {
    hero.classList.add("hidden");
    infoSec.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 400);
}

function backToHero() {
  const hero = document.getElementById("hero");
  const infoSec = document.getElementById("userInfoSection");
  if (!hero || !infoSec) return;

  infoSec.classList.add("hidden");
  hero.classList.remove("hidden");
  hero.style.opacity = "1";
  hero.style.transform = "translateY(0)";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ═══════════════════════════════════════════════════════════════
   SUBMIT PATIENT INFO → START QUIZ
   ═══════════════════════════════════════════════════════════════ */
function submitPatientInfo(event) {
  event.preventDefault();

  const nameVal = document.getElementById("userName").value.trim();
  const ageVal = document.getElementById("userAge").value.trim();
  const genderVal = document.getElementById("userGender").value;

  if (!nameVal || !ageVal || !genderVal) {
    alert("Please fill in your name, age, and gender to proceed.");
    return;
  }

  patientProfile.userName = nameVal;
  patientProfile.age = ageVal;
  patientProfile.gender = genderVal;

  const infoSec = document.getElementById("userInfoSection");
  const quizSec = document.getElementById("quizSection");

  infoSec.classList.add("hidden");
  quizSec.classList.remove("hidden");

  renderQuestion(0);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ═══════════════════════════════════════════════════════════════
   PROGRESS DOTS
   ═══════════════════════════════════════════════════════════════ */
function buildProgressDots() {
  const container = document.getElementById("progressDots");
  if (!container) return;
  container.innerHTML = "";
  QUESTIONS.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "p-dot";
    dot.id = `dot-${i}`;
    container.appendChild(dot);
  });
}

function updateProgressDots(activeIndex) {
  QUESTIONS.forEach((_, i) => {
    const dot = document.getElementById(`dot-${i}`);
    if (!dot) return;
    dot.className = "p-dot";
    const qKey = `Q${i + 1}`;
    if (i === activeIndex)               dot.classList.add("current");
    else if (answers[qKey] !== undefined) dot.classList.add("answered");
  });
}

/* ═══════════════════════════════════════════════════════════════
   RENDER QUESTION
   ═══════════════════════════════════════════════════════════════ */
function renderQuestion(index) {
  const q = QUESTIONS[index];
  const pct = Math.round(((index + 1) / QUESTIONS.length) * 100);

  document.getElementById("currentQ").textContent  = index + 1;
  document.getElementById("progressPct").textContent = `${pct}%`;
  document.getElementById("progressBar").style.width  = `${pct}%`;
  document.getElementById("qNumber").textContent     = `Q${index + 1}`;
  document.getElementById("questionText").textContent = q.text;

  // Animate card
  const card = document.getElementById("questionCard");
  card.style.opacity = "0";
  card.style.transform = "translateY(16px)";
  setTimeout(() => {
    card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
  }, 50);

  // Render options
  const optList = document.getElementById("optionsList");
  optList.innerHTML = "";
  const selectedVal = answers[`Q${index + 1}`];

  q.options.forEach((optText, optIdx) => {
    const item = document.createElement("div");
    item.className = "option-item" + (selectedVal === optIdx ? " selected" : "");
    item.setAttribute("role", "radio");
    item.setAttribute("aria-checked", selectedVal === optIdx ? "true" : "false");
    item.setAttribute("tabindex", "0");
    item.innerHTML = `
      <div class="option-radio"></div>
      <div class="option-text">${optText}</div>
    `;
    item.addEventListener("click", () => selectOption(index, optIdx));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectOption(index, optIdx);
      }
    });
    optList.appendChild(item);
  });

  // Nav buttons
  document.getElementById("prevBtn").disabled = (index === 0);
  const nextBtn = document.getElementById("nextBtn");
  const dict = I18N[currentLang] || I18N.en;
  nextBtn.innerHTML = (index === QUESTIONS.length - 1)
    ? `🔍 ${dict.btnSubmit}`
    : `${dict.btnNext} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

  const prevBtn = document.getElementById("prevBtn");
  if (prevBtn) {
    prevBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> ${dict.btnPrev}`;
  }

  // Validation message
  const valMsg = document.getElementById("validationMsg");
  if (valMsg) {
    valMsg.textContent = dict.validationErr;
    valMsg.classList.add("hidden");
  }

  // Progress dots
  updateProgressDots(index);
}

/* ═══════════════════════════════════════════════════════════════
   SELECT OPTION
   ═══════════════════════════════════════════════════════════════ */
function selectOption(questionIndex, optionIndex) {
  answers[`Q${questionIndex + 1}`] = optionIndex;

  const items = document.querySelectorAll(".option-item");
  items.forEach((item, i) => {
    item.classList.toggle("selected", i === optionIndex);
    item.setAttribute("aria-checked", i === optionIndex ? "true" : "false");
  });

  document.getElementById("validationMsg").classList.add("hidden");
  updateProgressDots(questionIndex);
}

/* ═══════════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════════ */
function nextQuestion() {
  const qKey = `Q${currentIndex + 1}`;
  if (answers[qKey] === undefined) {
    document.getElementById("validationMsg").classList.remove("hidden");
    document.getElementById("questionCard").style.animation = "none";
    setTimeout(() => {
      document.getElementById("questionCard").style.animation = "cardShake 0.4s ease";
    }, 10);
    return;
  }

  if (currentIndex < QUESTIONS.length - 1) {
    currentIndex++;
    renderQuestion(currentIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    submitAnswers();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion(currentIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* ═══════════════════════════════════════════════════════════════
   SUBMIT ANSWERS & USER DEMOGRAPHICS TO BACKEND
   ═══════════════════════════════════════════════════════════════ */
async function submitAnswers() {
  for (let i = 1; i <= QUESTIONS.length; i++) {
    if (answers[`Q${i}`] === undefined) {
      alert(`Please answer Question ${i} before submitting.`);
      currentIndex = i - 1;
      renderQuestion(currentIndex);
      return;
    }
  }

  showLoading(true);

  const payload = {
    user_name: patientProfile.userName,
    age: parseInt(patientProfile.age, 10),
    gender: patientProfile.gender,
    ...answers
  };

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Analysis failed. Please try again.");
    }

    window.location.href = "/result";

  } catch (err) {
    showLoading(false);
    showError(err.message || "An unexpected error occurred. Please try again.");
  }
}

/* ═══════════════════════════════════════════════════════════════
   UI HELPERS
   ═══════════════════════════════════════════════════════════════ */
function showLoading(show) {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.classList.toggle("hidden", !show);
}

function showError(msg) {
  const existing = document.getElementById("runtimeError");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "runtimeError";
  div.className = "flash-error";
  div.innerHTML = `
    ⚠️ ${msg}
    <button onclick="document.getElementById('runtimeError').remove()">✕</button>
  `;
  document.body.appendChild(div);

  setTimeout(() => {
    if (div.parentNode) div.remove();
  }, 6000);
}

/* Helper to convert HTML image element to Data URL */
function getBase64Image(imgEl) {
  if (!imgEl) return null;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = imgEl.naturalWidth || imgEl.width || 300;
    canvas.height = imgEl.naturalHeight || imgEl.height || 300;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgEl, 0, 0);
    return canvas.toDataURL("image/png");
  } catch (e) {
    console.error("Error converting image to data URL:", e);
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════
   CARD SHAKE ANIMATION
   ═══════════════════════════════════════════════════════════════ */
(function injectShake() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes cardShake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ═══════════════════════════════════════════════════════════════
   HIGH-QUALITY OFFICIAL CERTIFICATE PDF GENERATION
   (Embeds SleepAI LOGO.png & Seal Logo.png)
   ═══════════════════════════════════════════════════════════════ */
function downloadCertificatePDF() {
  if (typeof RESULT_DATA === "undefined" || typeof USER_INFO === "undefined") return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const W = 297;
  const H = 210;

  // ─ Background & Gold Frame Borders ─
  doc.setFillColor(8, 12, 18); // Deep Charcoal Obsidian
  doc.rect(0, 0, W, H, "F");

  // Outer Gold Decorative Border Frame
  doc.setLineWidth(1.8);
  doc.setDrawColor(245, 158, 11); // Sunset Gold
  doc.rect(10, 10, W - 20, H - 20);

  // Inner Fine Emerald Accent Frame
  doc.setLineWidth(0.6);
  doc.setDrawColor(16, 185, 129); // Emerald Green
  doc.rect(14, 14, W - 28, H - 28);

  // Corner Accent Circles
  function corner(x, y) {
    doc.setFillColor(245, 158, 11);
    doc.circle(x, y, 2.5, "F");
  }
  corner(14, 14);
  corner(W - 14, 14);
  corner(14, H - 14);
  corner(W - 14, H - 14);

  // ─ Header SleepAI Text ─
  let y = 28;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(52, 211, 153); // Emerald Mint
  doc.text("SleepAI", W / 2, y, { align: "center" });

  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(148, 163, 184);
  doc.text("DIGITAL HEALTH SCREENING SYSTEM", W / 2, y, { align: "center" });

  y += 12;
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.setTextColor(251, 191, 36); // Sunset Gold Title
  doc.text("CERTIFICATE OF SLEEP HEALTH ASSESSMENT", W / 2, y, { align: "center" });

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Certificate Registration ID: ${USER_INFO.certId}`, W / 2, y, { align: "center" });

  // Divider Line
  y += 6;
  doc.setLineWidth(0.5);
  doc.setDrawColor(251, 191, 36);
  doc.line(W / 2 - 60, y, W / 2 + 60, y);

  // ─ Candidate Certification Statement ─
  y += 12;
  doc.setFont("times", "italic");
  doc.setFontSize(11.5);
  doc.setTextColor(203, 213, 225);
  doc.text("This official certificate hereby verifies that", W / 2, y, { align: "center" });

  y += 11;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.setTextColor(255, 255, 255);
  doc.text(USER_INFO.name.toUpperCase(), W / 2, y, { align: "center" });

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Age: ${USER_INFO.age}  |  Gender: ${USER_INFO.gender}  |  Assessment Date: ${USER_INFO.timestamp}`, W / 2, y, { align: "center" });

  y += 11;
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(203, 213, 225);
  doc.text("has successfully completed the 20-Factor Clinical Sleep Disturbance Assessment.", W / 2, y, { align: "center" });

  // ─ Primary Result Box ─
  y += 9;
  doc.setFillColor(16, 26, 36);
  doc.roundedRect(W / 2 - 85, y, 170, 24, 4, 4, "F");
  doc.setLineWidth(0.8);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(W / 2 - 85, y, 170, 24, 4, 4, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`Primary Sleep Pattern: ${RESULT_DATA.disorder.toUpperCase()}`, W / 2, y + 10, { align: "center" });

  doc.setFontSize(9.5);
  doc.setTextColor(52, 211, 153);
  doc.text(`Clinical Pattern Match Confidence: ${RESULT_DATA.confidence}%`, W / 2, y + 18, { align: "center" });

  y += 30;

  // ─ Score Summary Pills ─
  const sc = RESULT_DATA.scores;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Insomnia Score: ${sc.Insomnia}/20   |   Sleep Apnea Score: ${sc["Sleep Apnea"]}/20   |   Hypersomnia Score: ${sc.Hypersomnia}/20`,
    W / 2, y, { align: "center" }
  );

  // ─ Text-based Gold Emblem Seal Portion ─
  y += 14;
  doc.setFillColor(245, 158, 11);
  doc.circle(W / 2, y, 11, "F");
  
  doc.setLineWidth(0.6);
  doc.setDrawColor(255, 255, 255);
  doc.circle(W / 2, y, 9.5, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(10, 15, 22);
  doc.text("SLEEPAI", W / 2, y - 1, { align: "center" });
  doc.text("VERIFIED", W / 2, y + 3, { align: "center" });

  // Bottom Disclaimer note
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text("SleepAI Digital Health Screening System • Non-Diagnostic Educational Assessment", W / 2, H - 15, { align: "center" });

  // Save PDF Certificate
  doc.save(`SleepAI_Official_Certificate_${USER_INFO.name.replace(/\s+/g, '_')}_${USER_INFO.certId}.pdf`);
}
