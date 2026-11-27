/* =========================================================
   LPU Learn - JavaScript
   All data is saved in the browser's localStorage, so the
   project works on GitHub Pages without any backend.
   (Note: passwords are stored as plain text because this is
   a learning project. A real website would use a server.)
   ========================================================= */

/* ---------- 1. Small helper for saving / loading data ---------- */
const store = {
  get(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem("lms2_" + key));
      return value === null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem("lms2_" + key, JSON.stringify(value));
  }
};

/* ---------- 2. Starting data (only used the first time) ---------- */
const sampleUsers = [
  { name: "ALBEDO Admin", email: "albeo@lpulearn.in", password: "Alblpulearn@1000", role: "admin", regNo: "", branch: "", bio: "" },
  { name: "LPU Admin", email: "admin@lpu.in", password: "admin@123", role: "admin", regNo: "", branch: "", bio: "" }
];

/* ---------- 3. Load everything into variables ---------- */
let users = store.get("users", sampleUsers);
let courses = store.get("courses", courseData);
let enrollments = store.get("enrollments", []);   // {email, courseId, done:[lesson numbers]}
let comments = store.get("comments", []);         // {id, courseId, email, name, rating, text, date}
let notes = store.get("notes", []);               // {id, email, text, date, read}
let openLessonIndex = null;                       // lesson currently being read
let openCourseId = null;                          // course currently shown in detail page

function saveAll() {
  store.set("users", users);
  store.set("courses", courses);
  store.set("enrollments", enrollments);
  store.set("comments", comments);
  store.set("notes", notes);
}

/* ---------- 4. Small helper functions ---------- */
// Stops user-typed text from being treated as HTML
function esc(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function $(id) { return document.getElementById(id); }

function currentUser() {
  const email = store.get("session", null);
  return users.find(u => u.email === email) || null;
}

function toast(message) {
  const box = $("toast");
  box.textContent = message;
  box.classList.remove("hidden");
  setTimeout(() => box.classList.add("hidden"), 2600);
}

function addNote(email, text) {
  notes.unshift({ id: Date.now() + Math.random(), email: email, text: text, date: new Date().toLocaleString(), read: false });
  saveAll();
}

function getEnrollment(email, courseId) {
  return enrollments.find(e => e.email === email && e.courseId === courseId);
}

function percentDone(enrollment, course) {
  if (!enrollment || course.lessons.length === 0) return 0;
  return Math.round((enrollment.done.length / course.lessons.length) * 100);
}

function averageRating(courseId) {
  const list = comments.filter(c => c.courseId === courseId);
  if (list.length === 0) return "No ratings yet";
  const total = list.reduce((sum, c) => sum + c.rating, 0);
  return "\u2605 " + (total / list.length).toFixed(1) + " (" + list.length + ")";
}

/* ---------- 5. Page navigation ---------- */
const VIEWS = ["courses", "detail", "lesson", "learning", "profile", "notifications", "admin", "auth"];

function showView(name) {
  const user = currentUser();

  if (["learning", "profile", "notifications"].includes(name) && !user) {
    toast("Please log in first.");
    name = "auth";
  }
  if (name === "admin" && (!user || user.role !== "admin")) {
    toast("This page is only for admins.");
    name = "courses";
  }

  VIEWS.forEach(v => $("view-" + v).classList.toggle("hidden", v !== name));
  $("nav").classList.remove("open");

  if (name === "courses") renderCourses();
  if (name === "learning") renderLearning();
  if (name === "profile") renderProfile();
  if (name === "notifications") renderNotes();
  if (name === "admin") renderAdmin();

  renderNav();
  window.scrollTo(0, 0);
}

function toggleMenu() {
  $("nav").classList.toggle("open");
}

// Show or hide menu buttons depending on who is logged in
function renderNav() {
  const user = currentUser();
  $("nav-learning").classList.toggle("hidden", !user);
  $("nav-notifications").classList.toggle("hidden", !user);
  $("nav-profile").classList.toggle("hidden", !user);
  $("nav-admin").classList.toggle("hidden", !(user && user.role === "admin"));
  $("nav-login").classList.toggle("hidden", !!user);
  $("nav-logout").classList.toggle("hidden", !user);

  const unread = user ? notes.filter(n => n.email === user.email && !n.read).length : 0;
  $("badge").textContent = unread;
  $("badge").classList.toggle("hidden", unread === 0);
}

/* ---------- 6. Login / Register / Logout ---------- */
function showAuth(which) {
  $("loginForm").classList.toggle("hidden", which !== "login");
  $("registerForm").classList.toggle("hidden", which !== "register");
  $("tab-login").classList.toggle("active", which === "login");
  $("tab-register").classList.toggle("active", which === "register");
}

function register(event) {
  event.preventDefault();
  const email = $("rEmail").value.trim().toLowerCase();

  if (users.some(u => u.email === email)) {
    toast("This email is already registered. Please log in.");
    return;
  }

  users.push({
    name: $("rName").value.trim(),
    email: email,
    password: $("rPass").value,
    role: "student",
    regNo: $("rReg").value.trim(),
    branch: "",
    bio: ""
  });
  store.set("session", email);
  addNote(email, "Welcome to LPU Learn! Browse the courses and enroll to get started.");
  $("registerForm").reset();
  toast("Account created. You are now logged in.");
  showView("courses");
}

function login(event) {
  event.preventDefault();
  const email = $("lEmail").value.trim().toLowerCase();
  const user = users.find(u => u.email === email && u.password === $("lPass").value);

  if (!user) {
    toast("Wrong email or password. Please try again.");
    return;
  }
  store.set("session", user.email);
  $("loginForm").reset();
  toast("Welcome back, " + user.name + "!");
  showView(user.role === "admin" ? "admin" : "courses");
}

function logout() {
  store.set("session", null);
  toast("You have been logged out.");
  showView("courses");
}

/* ---------- 7. Course catalog (search + category filter) ---------- */
function renderCategoryOptions() {
  const select = $("categoryFilter");
  const chosen = select.value || "All";
  const categories = ["All"].concat([...new Set(courses.map(c => c.category))]);
  select.innerHTML = categories.map(c => `<option value="${esc(c)}">${c === "All" ? "All categories" : esc(c)}</option>`).join("");
  select.value = categories.includes(chosen) ? chosen : "All";
}

function renderCourses() {
  renderCategoryOptions();
  const search = $("searchBox").value.trim().toLowerCase();
  const category = $("categoryFilter").value;
  const user = currentUser();

  const list = courses.filter(c => {
    const matchesText = c.title.toLowerCase().includes(search) || c.instructor.toLowerCase().includes(search);
    const matchesCategory = category === "All" || c.category === category;
    return matchesText && matchesCategory;
  });

  if (list.length === 0) {
    $("courseGrid").innerHTML = '<p class="muted">No courses match your search. Try a different word or category.</p>';
    return;
  }

  $("courseGrid").innerHTML = list.map(c => {
    const enrolled = user && getEnrollment(user.email, c.id);
    return `
      <article class="card">
        <span class="tag">${esc(c.category)}</span>
        <h3>${esc(c.title)}</h3>
        <p class="muted small">${esc(c.instructor)} &middot; ${c.lessons.length} lessons &middot; ${esc(c.level)}</p>
        <p>${esc(c.description)}</p>
        <div class="card-foot">
          <span class="rating">${averageRating(c.id)}</span>
          <button class="btn btn-small" onclick="openCourse(${c.id})">${enrolled ? "Continue" : "View course"}</button>
        </div>
      </article>`;
  }).join("");
}

/* ---------- 8. Course detail: enroll, lessons, feedback ---------- */
function openCourse(id) {
  openCourseId = id;
  renderDetail();
  showView("detail");
}

function renderDetail() {
  const course = courses.find(c => c.id === openCourseId);
  if (!course) { showView("courses"); return; }

  const user = currentUser();
  const enrollment = user ? getEnrollment(user.email, course.id) : null;
  const percent = percentDone(enrollment, course);

  // Top part: title and enroll button / progress bar
  let html = `
    <div class="panel detail-head">
      <span class="tag">${esc(course.category)}</span>
      <h2>${esc(course.title)}</h2>
      <p class="muted">${esc(course.instructor)} &middot; ${esc(course.level)} &middot; ${averageRating(course.id)}</p>
      <p>${esc(course.description)}</p>`;

  if (enrollment) {
    html += `
      <p><strong>Your progress: ${percent}%</strong></p>
      <div class="progress"><div class="progress-fill" style="width:${percent}%"></div></div>`;
  } else {
    html += `<button class="btn" onclick="enroll(${course.id})">Enroll in this course</button>`;
  }
  html += `</div>`;

  // Lessons (click a lesson to read its theory)
  html += `<div class="panel"><h3 style="margin-top:0">Lessons</h3><ul class="lesson-list">`;
  course.lessons.forEach((lesson, index) => {
    const done = enrollment && enrollment.done.includes(index);
    html += `<li class="lesson-row">
      <button class="lesson-link" onclick="openLesson(${index})">
        <span class="lesson-status ${done ? "is-done" : ""}">${done ? "&#10003;" : index + 1}</span>
        <span>${esc(lesson.title)}</span>
        <span class="muted small lesson-go">${done ? "Completed" : "Read"}</span>
      </button>
    </li>`;
  });
  html += `</ul>`;
  if (!enrollment) html += `<p class="muted small" style="margin-top:10px">You can preview the theory now. Enroll to track your progress.</p>`;
  html += `</div>`;

  // Feedback
  const list = comments.filter(c => c.courseId === course.id);
  html += `<div class="panel" style="margin-top:18px"><h3 style="margin-top:0">Feedback</h3>`;
  if (list.length === 0) {
    html += `<p class="muted">No feedback yet. Be the first to share your thoughts.</p>`;
  }
  list.forEach(c => {
    html += `<div class="comment"><strong>${esc(c.name)}</strong>
      <span class="rating">${"\u2605".repeat(c.rating)} &middot; ${esc(c.date)}</span>
      <p>${esc(c.text)}</p></div>`;
  });

  if (enrollment) {
    html += `
      <form class="form" style="margin-top:16px" onsubmit="addComment(event)">
        <label>Your rating
          <select id="cmRating">
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Very poor</option>
          </select>
        </label>
        <label>Your comment
          <textarea id="cmText" rows="3" required></textarea>
        </label>
        <button class="btn" type="submit">Post feedback</button>
      </form>`;
  } else {
    html += `<p class="muted small" style="margin-top:12px">Only enrolled learners can post feedback.</p>`;
  }
  html += `</div>`;

  $("courseDetail").innerHTML = html;
}

function enroll(courseId) {
  const user = currentUser();
  if (!user) {
    toast("Please log in to enroll.");
    showView("auth");
    return;
  }
  const course = courses.find(c => c.id === courseId);
  enrollments.push({ email: user.email, courseId: courseId, done: [] });
  addNote(user.email, "You enrolled in " + course.title + ".");
  saveAll();
  toast("Enrolled successfully!");
  renderDetail();
  if (!$("view-lesson").classList.contains("hidden")) renderLesson();
  renderNav();
}

// Opens the reading page for one lesson
function openLesson(index) {
  openLessonIndex = index;
  renderLesson();
  showView("lesson");
}

function renderLesson() {
  const course = courses.find(c => c.id === openCourseId);
  const lesson = course.lessons[openLessonIndex];
  const user = currentUser();
  const enrollment = user ? getEnrollment(user.email, course.id) : null;
  const done = enrollment && enrollment.done.includes(openLessonIndex);
  const isLast = openLessonIndex === course.lessons.length - 1;

  // a blank line in the theory starts a new paragraph
  const theory = (lesson.theory || "The instructor has not added notes for this lesson yet.")
    .split("\n\n").map(p => `<p>${esc(p)}</p>`).join("");

  // the button changes depending on the learner's state
  let action;
  if (!enrollment) {
    action = `<button class="btn" onclick="enroll(${course.id})">Enroll to track this lesson</button>`;
  } else if (done) {
    action = `<button class="btn btn-light" onclick="toggleLesson()">&#10003; Completed (click to undo)</button>`;
  } else {
    action = `<button class="btn" onclick="toggleLesson()">Mark as completed</button>`;
  }

  $("lessonPage").innerHTML = `
    <div class="panel reader">
      <p class="muted small">${esc(course.title)} &middot; Lesson ${openLessonIndex + 1} of ${course.lessons.length}</p>
      <h2>${esc(lesson.title)}</h2>
      <div class="theory">${theory}</div>
      <div class="reader-actions">${action}</div>
    </div>
    <div class="lesson-nav">
      <button class="btn btn-light" ${openLessonIndex === 0 ? "disabled" : ""} onclick="openLesson(${openLessonIndex - 1})">&larr; Previous</button>
      <button class="btn btn-light" onclick="openCourse(${course.id})">All lessons</button>
      <button class="btn btn-light" ${isLast ? "disabled" : ""} onclick="openLesson(${openLessonIndex + 1})">Next &rarr;</button>
    </div>`;
}

// Called after the learner finishes reading and clicks the button
function toggleLesson() {
  const user = currentUser();
  const course = courses.find(c => c.id === openCourseId);
  const enrollment = getEnrollment(user.email, course.id);
  const index = openLessonIndex;

  if (enrollment.done.includes(index)) {
    enrollment.done = enrollment.done.filter(i => i !== index);
  } else {
    enrollment.done.push(index);
    toast("Lesson marked as completed.");
    if (percentDone(enrollment, course) === 100) {
      addNote(user.email, "Congratulations! You completed " + course.title + ".");
      toast("Course completed!");
    }
  }
  saveAll();
  renderLesson();
  renderNav();
}

function addComment(event) {
  event.preventDefault();
  const user = currentUser();
  comments.push({
    id: Date.now(),
    courseId: openCourseId,
    email: user.email,
    name: user.name,
    rating: Number($("cmRating").value),
    text: $("cmText").value.trim(),
    date: new Date().toLocaleDateString()
  });
  saveAll();
  toast("Thanks for your feedback!");
  renderDetail();
}

/* ---------- 9. My Learning (progress tracking) ---------- */
function renderLearning() {
  const user = currentUser();
  const mine = enrollments.filter(e => e.email === user.email);

  if (mine.length === 0) {
    $("learningList").innerHTML = '<p class="muted">You have not enrolled in any course yet. Open the Courses page to get started.</p>';
    return;
  }

  $("learningList").innerHTML = mine.map(e => {
    const course = courses.find(c => c.id === e.courseId);
    if (!course) return "";
    const percent = percentDone(e, course);
    return `
      <article class="card">
        <span class="tag">${esc(course.category)}</span>
        <h3>${esc(course.title)}</h3>
        <p class="muted small">${e.done.length} of ${course.lessons.length} lessons completed</p>
        <div class="progress"><div class="progress-fill" style="width:${percent}%"></div></div>
        <div class="card-foot">
          <strong>${percent}%</strong>
          <button class="btn btn-small" onclick="openCourse(${course.id})">${percent === 100 ? "Review" : "Continue"}</button>
        </div>
      </article>`;
  }).join("");
}

/* ---------- 10. Profile ---------- */
function renderProfile() {
  const user = currentUser();
  $("pName").value = user.name;
  $("pEmail").value = user.email;
  $("pReg").value = user.regNo || "";
  $("pBranch").value = user.branch || "";
  $("pBio").value = user.bio || "";
}

function saveProfile(event) {
  event.preventDefault();
  const user = currentUser();
  user.name = $("pName").value.trim();
  user.regNo = $("pReg").value.trim();
  user.branch = $("pBranch").value.trim();
  user.bio = $("pBio").value.trim();
  saveAll();
  toast("Profile saved.");
}

/* ---------- 11. Notifications ---------- */
function renderNotes() {
  const user = currentUser();
  const mine = notes.filter(n => n.email === user.email);

  if (mine.length === 0) {
    $("noteList").innerHTML = '<li class="muted">You have no notifications.</li>';
    return;
  }
  $("noteList").innerHTML = mine.map(n => `
    <li class="${n.read ? "" : "unread"}">
      ${esc(n.text)}<br><span class="muted small">${esc(n.date)}</span>
    </li>`).join("");
}

function markAllRead() {
  const user = currentUser();
  notes.forEach(n => { if (n.email === user.email) n.read = true; });
  saveAll();
  renderNotes();
  renderNav();
}

/* ---------- 12. Admin panel ---------- */
function renderAdmin() {
  const students = users.filter(u => u.role === "student");

  $("adminStats").innerHTML = `
    <div class="stat"><strong>${students.length}</strong>Students</div>
    <div class="stat"><strong>${courses.length}</strong>Courses</div>
    <div class="stat"><strong>${enrollments.length}</strong>Enrollments</div>
    <div class="stat"><strong>${comments.length}</strong>Feedback posts</div>`;

  $("adminCourses").innerHTML = `
    <tr><th>Title</th><th>Category</th><th>Lessons</th><th>Enrolled</th><th>Action</th></tr>` +
    courses.map(c => `
      <tr>
        <td>${esc(c.title)}</td>
        <td>${esc(c.category)}</td>
        <td>${c.lessons.length}</td>
        <td>${enrollments.filter(e => e.courseId === c.id).length}</td>
        <td><button class="btn btn-danger btn-small" onclick="deleteCourse(${c.id})">Delete</button></td>
      </tr>`).join("");

  $("adminUsers").innerHTML = `
    <tr><th>Name</th><th>Email</th><th>Reg. No.</th><th>Role</th><th>Action</th></tr>` +
    users.map(u => `
      <tr>
        <td>${esc(u.name)}</td>
        <td>${esc(u.email)}</td>
        <td>${esc(u.regNo || "-")}</td>
        <td>${esc(u.role)}</td>
        <td>${u.role === "admin" ? "-" : `<button class="btn btn-danger btn-small" onclick="deleteUser('${esc(u.email)}')">Remove</button>`}</td>
      </tr>`).join("");
}

function addCourse(event) {
  event.preventDefault();
  // each line is "Lesson title | theory text" (the theory part is optional)
  const lessons = $("cLessons").value.split("\n")
    .map(line => line.trim())
    .filter(line => line !== "")
    .map(line => {
      const parts = line.split("|");
      return { title: parts[0].trim(), theory: parts.slice(1).join("|").trim() };
    });

  if (lessons.length === 0) {
    toast("Please add at least one lesson.");
    return;
  }

  const newCourse = {
    id: Date.now(),
    title: $("cTitle").value.trim(),
    category: $("cCategory").value.trim(),
    instructor: $("cInstructor").value.trim(),
    level: $("cLevel").value,
    description: $("cDesc").value.trim(),
    lessons: lessons
  };
  courses.push(newCourse);

  // tell every student that a new course is available
  users.filter(u => u.role === "student").forEach(u => addNote(u.email, "New course added: " + newCourse.title));

  saveAll();
  $("courseForm").reset();
  toast("Course added.");
  renderAdmin();
}

function deleteCourse(id) {
  if (!confirm("Delete this course? Enrollments and feedback for it will also be removed.")) return;
  courses = courses.filter(c => c.id !== id);
  enrollments = enrollments.filter(e => e.courseId !== id);
  comments = comments.filter(c => c.courseId !== id);
  saveAll();
  toast("Course deleted.");
  renderAdmin();
}

function deleteUser(email) {
  if (!confirm("Remove this user and all of their data?")) return;
  users = users.filter(u => u.email !== email);
  enrollments = enrollments.filter(e => e.email !== email);
  comments = comments.filter(c => c.email !== email);
  notes = notes.filter(n => n.email !== email);
  saveAll();
  toast("User removed.");
  renderAdmin();
}

/* ---------- 13. Theme button: light -> night -> neon -> light ---------- */
const themes = [
  { name: "light", icon: "\u2600\uFE0F" },
  { name: "night", icon: "\uD83C\uDF19" },
  { name: "neon", icon: "\u26A1" }
];

function applyTheme(name) {
  const theme = themes.find(t => t.name === name) || themes[0];
  document.documentElement.setAttribute("data-theme", theme.name);
  $("themeBtn").textContent = theme.icon;
  $("themeBtn").title = "Theme: " + theme.name + " (click to change)";
  store.set("theme", theme.name);
}

function cycleTheme() {
  const index = themes.findIndex(t => t.name === store.get("theme", "light"));
  applyTheme(themes[(index + 1) % themes.length].name);
}

/* ---------- 14. Start the website ---------- */
applyTheme(store.get("theme", "light"));
saveAll();       // saves the starting data the first time
showView("courses");
