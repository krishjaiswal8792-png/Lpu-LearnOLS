/* =========================================================
   LPU Learn - Course content
   Every lesson has a title and its theory text.
   A blank line inside the theory starts a new paragraph.
   ========================================================= */
const L = (title, theory) => ({ title: title, theory: theory });

const courseData = [
  {
    id: 1, title: "Web Development Basics", category: "Programming",
    instructor: "LPU Faculty", level: "Beginner",
    description: "Build your first website using HTML, CSS and JavaScript.",
    lessons: [
      L("Introduction to HTML",
        "HTML (HyperText Markup Language) gives a web page its structure. It is written with tags such as <h1> for headings, <p> for paragraphs, <a> for links and <img> for images. Most tags have an opening and a closing part, and they can be nested inside each other.\n\nEvery page starts with <!DOCTYPE html> and has a <head> (title, links to CSS) and a <body> (the content people see). Use semantic tags like <header>, <nav>, <main> and <footer> so that both browsers and search engines understand your page."),
      L("Styling with CSS",
        "CSS (Cascading Style Sheets) controls how HTML looks: colours, fonts, spacing and layout. A rule has a selector and declarations, for example h1 { color: orange; }. You can select by tag, by class (.card) or by id (#menu).\n\nThe box model explains spacing: every element has content, padding, border and margin. Keep CSS in a separate file and link it, so one change can restyle the whole website."),
      L("Layouts with Flexbox and Grid",
        "Flexbox arranges items in one direction, either a row or a column. With display: flex you can use justify-content and align-items to centre or spread items. It is ideal for navigation bars and card rows.\n\nGrid works in two directions at once. grid-template-columns lets you define columns, and repeat(auto-fill, minmax(280px, 1fr)) makes a layout that adjusts to the screen size. Media queries then fine-tune the design for phones."),
      L("JavaScript basics",
        "JavaScript is the programming language of the browser. You store values in variables (let, const), make decisions with if and else, repeat work with loops, and group code into functions.\n\nData types you will use most are strings, numbers, booleans, arrays and objects. Use console.log() to check values while you are learning. Always test small pieces of code before combining them."),
      L("Making pages interactive",
        "The DOM (Document Object Model) is the browser's tree of your page. With document.getElementById() you can pick an element and change its text, style or classes.\n\nEvents such as click, submit and input let the page react to the user: element.addEventListener('click', function). Saving data with localStorage lets a page remember information even after it is closed, which is how this project keeps your login and progress.")
    ]
  },
  {
    id: 2, title: "Mathematics for Engineers", category: "Mathematics",
    instructor: "LPU Faculty", level: "Intermediate",
    description: "Matrices, differentiation, integration and differential equations explained step by step.",
    lessons: [
      L("Matrices and determinants",
        "A matrix is a rectangular arrangement of numbers in rows and columns. We can add matrices of the same order, and multiply A (m x n) with B (n x p) to get an m x p matrix. Matrix multiplication is not commutative, so AB is usually not equal to BA.\n\nThe determinant of a square matrix tells us whether it is invertible. If det(A) is not zero, the inverse exists and equals adj(A) / det(A). The rank of a matrix is the number of independent rows and is used to check if a system of equations is consistent."),
      L("Eigenvalues and eigenvectors",
        "For a square matrix A, a non-zero vector X is an eigenvector if AX = lambda X. The number lambda is the eigenvalue. To find them, solve the characteristic equation det(A - lambda I) = 0.\n\nUseful facts: the sum of the eigenvalues equals the trace of A, and their product equals det(A). The Cayley-Hamilton theorem says every matrix satisfies its own characteristic equation, which helps in finding inverses and powers."),
      L("Partial differentiation",
        "When a function depends on more than one variable, such as f(x, y), we differentiate with respect to one variable while treating the others as constants. This gives the partial derivatives fx and fy.\n\nEuler's theorem applies to homogeneous functions of degree n: x fx + y fy = n f. The total differential df = fx dx + fy dy is used to estimate small errors in engineering measurements. Maxima and minima use the conditions fx = 0 and fy = 0."),
      L("Multiple integrals",
        "A double integral adds up a function over a region of the plane, and a triple integral does the same over a solid. They are used to find area, volume, mass and centre of gravity.\n\nSolve them from the inside out, one variable at a time. Sometimes changing the order of integration or moving to polar coordinates (x = r cos t, y = r sin t, dx dy = r dr dt) makes the problem much easier."),
      L("First order differential equations",
        "A differential equation relates a function to its derivatives. Its order is the highest derivative present. For first order equations, first identify the type: variables separable, homogeneous, exact, or linear.\n\nA linear equation dy/dx + P y = Q is solved using the integrating factor e^(integral of P dx). Applications include Newton's law of cooling, population growth and the charging of an electric circuit.")
    ]
  },
  {
    id: 3, title: "Python for Beginners", category: "Programming",
    instructor: "LPU Faculty", level: "Beginner",
    description: "Learn variables, loops, functions and lists with small practice programs.",
    lessons: [
      L("Installing Python",
        "Python is a simple, readable language used in web development, data science and automation. Download the latest version from python.org and tick the option 'Add Python to PATH' during installation.\n\nYou can write code in IDLE, VS Code or any editor. Save files with the .py extension and run them with python filename.py. Your first program is print('Hello, LPU')."),
      L("Variables and data types",
        "A variable is a name that stores a value, such as age = 18. Python decides the type by itself. The common types are int (whole numbers), float (decimals), str (text) and bool (True or False).\n\nUse input() to read from the user (it always returns text, so convert with int() or float()) and print() to show results. Variable names should be meaningful, like total_marks instead of x."),
      L("Conditions and loops",
        "The if, elif and else statements let a program choose between paths. Indentation matters in Python: the indented lines belong to the block above them.\n\nA for loop repeats code for each item in a sequence, for example for i in range(5). A while loop repeats as long as a condition stays true. Use break to stop a loop early and continue to skip one round."),
      L("Functions",
        "A function is a reusable block of code created with def. For example, def add(a, b): return a + b. Functions take parameters and can send a result back with return.\n\nSplitting a program into small functions makes it easier to read, test and fix. Variables created inside a function are local and cannot be used outside it."),
      L("Lists and dictionaries",
        "A list stores many items in order, like marks = [78, 85, 92]. You can read an item by its index (starting from 0), add with append(), remove with remove() and loop through it with a for loop.\n\nA dictionary stores key-value pairs, like student = {'name': 'Aman', 'age': 18}. You read a value using its key, student['name']. Lists and dictionaries together can represent almost any real data.")
    ]
  },
  {
    id: 4, title: "Arduino Starter Kit", category: "Electronics",
    instructor: "LPU Faculty", level: "Beginner",
    description: "Understand the Arduino board and build simple sensor based projects.",
    lessons: [
      L("What is a microcontroller?",
        "A microcontroller is a tiny computer on a single chip. It has a processor, memory and input/output pins. An Arduino Uno is a board built around the ATmega328P microcontroller, with 14 digital pins and 6 analog input pins.\n\nIt reads inputs from sensors and buttons, runs your program, and controls outputs like LEDs, motors and buzzers. You program it in the Arduino IDE and upload the code through a USB cable."),
      L("Blinking an LED",
        "Every Arduino program has two functions. setup() runs once when the board starts, and loop() runs again and again forever.\n\nTo blink an LED, set the pin with pinMode(13, OUTPUT), then switch it using digitalWrite(13, HIGH), wait with delay(1000), and switch it off with digitalWrite(13, LOW). Always use a 220 ohm resistor in series with an external LED to protect it."),
      L("Reading a sensor",
        "Digital sensors, such as a push button or PIR motion sensor, give HIGH or LOW and are read with digitalRead(). Analog sensors, like an LDR or temperature sensor, give a range of values read with analogRead(), which returns 0 to 1023.\n\nUse Serial.begin(9600) in setup() and Serial.println(value) in loop() to see sensor readings on the Serial Monitor. This is the best way to debug your circuit."),
      L("Using a buzzer and display",
        "A buzzer makes a sound when its pin is HIGH, and the tone() function can play different frequencies. An LCD (16x2) shows text, and the LiquidCrystal library gives easy commands such as lcd.print() and lcd.setCursor().\n\nCombining inputs and outputs creates a real project. For example, read a temperature sensor, show the value on the LCD and sound the buzzer if it crosses a limit.")
    ]
  },
  {
    id: 5, title: "Communication Skills", category: "Soft Skills",
    instructor: "LPU Faculty", level: "Beginner",
    description: "Improve speaking, writing and presentation skills for interviews and group work.",
    lessons: [
      L("Active listening",
        "Good communication begins with listening. Active listening means giving full attention, not interrupting, and showing that you understand through nodding, eye contact and short responses.\n\nParaphrase what you heard ('So you mean the deadline is Friday?') and ask follow-up questions. This avoids misunderstandings and builds trust with teachers, teammates and interviewers."),
      L("Writing a clear email",
        "A professional email has a clear subject line, a polite greeting, a short body and a proper closing. State your purpose in the first two lines, keep paragraphs short, and use simple words.\n\nCheck the recipient, spelling and attachments before you send. Close with 'Regards' or 'Thank you' followed by your name and registration number when writing to the university."),
      L("Presentation basics",
        "A good presentation has an opening, a middle with two or three main points, and a conclusion. Keep slides light: a short heading, a few words per point and a relevant image or chart.\n\nPractise aloud, speak slowly, look at the audience and keep to your time limit. Do not read word for word from the slide; the slide supports you and you tell the story."),
      L("Group discussion tips",
        "In a group discussion, start with a clear point if you get the chance, support it with an example or a fact, and respect other speakers. Do not shout or interrupt.\n\nListen to others and connect your points to theirs ('I agree with Riya, and I would add...'). If the discussion goes off topic, politely bring it back. Finish with a short summary if the group allows.")
    ]
  },
  {
    id: 6, title: "Environmental Studies", category: "Environmental Studies",
    instructor: "LPU Faculty", level: "Beginner",
    description: "Learn about ecosystems, pollution and sustainable living.",
    lessons: [
      L("Ecosystems",
        "An ecosystem is a community of living things (biotic) interacting with their non-living surroundings (abiotic), such as soil, water and air. Forests, ponds, grasslands and deserts are examples.\n\nEnergy flows in one direction from the sun to producers (plants), then to consumers (herbivores and carnivores) and finally to decomposers. Food chains join into food webs, and only about 10 percent of energy passes to the next level."),
      L("Natural resources",
        "Natural resources are materials from nature that we use. Renewable resources, like solar energy, wind and water, can be replaced naturally. Non-renewable resources, like coal, petroleum and natural gas, take millions of years to form.\n\nOveruse causes problems such as deforestation, water scarcity and loss of soil fertility. Using resources wisely, recycling and shifting to renewable energy are the main solutions."),
      L("Pollution and its control",
        "Pollution is the addition of harmful substances to the environment. Its main types are air, water, soil and noise pollution. Causes include vehicle smoke, factory waste, plastic and chemical fertilisers.\n\nEffects include respiratory diseases, contaminated water and global warming. Control measures include public transport, waste treatment plants, planting trees, banning single-use plastic and following pollution-control laws."),
      L("Sustainable development",
        "Sustainable development means meeting today's needs without harming the ability of future generations to meet theirs. It balances three parts: the environment, the economy and society.\n\nExamples include rainwater harvesting, solar power, waste segregation and energy-saving buildings. The United Nations has set 17 Sustainable Development Goals (SDGs) to guide countries towards this target by 2030.")
    ]
  }
];
