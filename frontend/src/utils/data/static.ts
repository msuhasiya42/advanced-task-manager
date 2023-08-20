// static data of tasks

const currentDate = new Date();

const options: Intl.DateTimeFormatOptions = { 
  day: "numeric", 
  month: "long", 
  year: "numeric" 
};

const dateString = currentDate.toLocaleString("en-US", options);


export const todos = [
  {
    title: "Create Portfolio site",
    desc: "Portfolio site to showcase project and resume",
    dueDate: dateString,
  },

  {
    title: "Organize Desk",
    desc: "",
    dueDate: dateString,
  },

  {
    title: "Read Lean Startup",
    desc: "Read this book to get idea of building start up, how it is organized",

    dueDate: dateString,
  },

  {
    title: "Clean Room",
    desc: "",
    dueDate: dateString,
  },
];
export const inprogress = [
  {
    title: "Learning Express Js",
    desc: "",
    dueDate: dateString,
  },
  {
    title: "Learning MongoDb",
    desc: " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque accusantium amet pariatur qui voluptatem molestias aperiam accusamus ipsum ut at odio, necessitatibus harum eveniet voluptatum? Nobis maxime minima illo provident! ",
    dueDate: dateString,
  },
  {
    title: "Reading Alchemist",
    desc: "",
    dueDate: dateString,
  },
];
export const completed = [
  {
    title: "React Basics",
    desc: "",
    dueDate: dateString,
  },
  {
    title: "Reading Fastlane Millionaire",
    desc: "",
    dueDate: dateString,
  },
];

export const members = ["Mayur", "Raksha", "Jade", "Rohan", "Rahul"];
export const tags = ["work", "personal", "jobhunt", "learning"];
