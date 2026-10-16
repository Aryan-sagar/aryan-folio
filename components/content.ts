// All the personal content lives here. Edit freely: add `src` (image URL in /public) to frames and `poster` to picks.

export const FRAMES = [
  { shot: "01", loc: "Manali", cam: "iPhone", src: "/film/shot1.jpg" },
  { shot: "02", loc: "Rishikesh", cam: "iPhone", src: "/film/shot2.jpg" },
  { shot: "03", loc: "IIT Ropar", cam: "iPhone", src: "/film/shot3.jpg" },
  { shot: "04", loc: "IIT Ropar", cam: "iPhone", src: "/film/shot4.jpg" },
  { shot: "05", loc: "IIT Ropar", cam: "iPhone", src: "/film/shot5.jpg" },
  { shot: "06", loc: "Mumbai", cam: "iPhone", src: "/film/shot6.jpg" },
  { shot: "07", loc: "Mussorie", cam: "iPhone", src: "/film/shot7.jpg" },
];

export type Pick = { t: string; kind: "movie" | "anime"; by: string; year: string; genre: string; stars: number; note: string; color: string; poster?: string; placeholder?: boolean };

// Notes are short factual loglines. Replace any with your own reason for recommending it. Add poster: "/posters/name.jpg" to use a real poster.
export const WATCH: Pick[] = [
  { t: "The Dark Knight", kind: "movie", by: "Christopher Nolan", year: "2008", genre: "Crime, superhero", stars: 5, color: "#b83232",
    note: "Batman against the Joker, in Nolan's Gotham." },
  { t: "Good Will Hunting", kind: "movie", by: "Gus Van Sant", year: "1997", genre: "Drama", stars: 5, color: "#0e8fb0",
    note: "A janitor who is a gifted mathematician, and the therapist trying to reach him." },
  { t: "Interstellar", kind: "movie", by: "Christopher Nolan", year: "2014", genre: "Sci-fi", stars: 5, color: "#7a4bd1",
    note: "A film I keep coming back to for its ideas about time, love and humanity." },
  { t: "Inception", kind: "movie", by: "Christopher Nolan", year: "2010", genre: "Sci-fi, thriller", stars: 5, color: "#c9a20f",
    note: "A team enters dreams to plant a single idea." },
  { t: "Fight Club", kind: "movie", by: "David Fincher", year: "1999", genre: "Drama, thriller", stars: 5, color: "#e0654a",
    note: "An insomniac and a soap salesman start an underground club." },
  { t: "12 Angry Men", kind: "movie", by: "Sidney Lumet", year: "1957", genre: "Drama", stars: 5, color: "#8c8a85",
    note: "One juror holds out, and a whole room changes its mind." },
  { t: "Attack on Titan", kind: "anime", by: "Wit Studio / MAPPA", year: "2013", genre: "Action, dark fantasy", stars: 5, color: "#b83232",
    note: "Humanity walled in against giants, and a war that keeps changing what it is about." },
  { t: "Bleach", kind: "anime", by: "Studio Pierrot", year: "2004", genre: "Action, supernatural", stars: 5, color: "#0e8fb0",
    note: "A teenager inherits a soul reaper's powers to defend the living from spirits." },
  { t: "Naruto", kind: "anime", by: "Studio Pierrot", year: "2002", genre: "Action, adventure", stars: 5, color: "#e0654a",
    note: "An outcast ninja with a sealed fox spirit dreams of becoming Hokage." },
  { t: "Death Note", kind: "anime", by: "Madhouse", year: "2006", genre: "Psychological thriller", stars: 5, color: "#7a4bd1",
    note: "A student finds a notebook that kills, and a detective sets out to catch him." },
  { t: "Erased", kind: "anime", by: "A-1 Pictures", year: "2016", genre: "Mystery, thriller", stars: 5, color: "#159947",
    note: "A man who can rewind time tries to stop a childhood tragedy." },
  { t: "Steins;Gate", kind: "anime", by: "White Fox", year: "2011", genre: "Sci-fi, thriller", stars: 5, color: "#c9a20f",
    note: "Messages sent to the past start rewriting the present." },
  { t: "Black Clover", kind: "anime", by: "Studio Pierrot", year: "2017", genre: "Action, fantasy", stars: 5, color: "#d9c9a8",
    note: "A boy born without magic in a world full of it aims to become the Wizard King." },
];

// img: the full-screen background photo for each side quest. Put it in /public/side/ with this exact name. Until it exists, a dark colour gradient shows instead.
export type Quest = { t: string; d: string; c: string; img?: string; href?: string };
export const SIDE: Quest[] = [
  { t: "Philosophy", d: "Trying to understand why we believe what we believe, and whether we should.", c: "#d9c9a8", img: "/side/philosophy.jpg" },
  { t: "History", d: "The present makes a lot more sense when you know what came before it.", c: "#c9a20f", img: "/side/history.jpg" },
  { t: "Travel", d: "Collecting places, photographs and stories.", c: "#0e8fb0", img: "/side/travel.jpg" },
  { t: "Filmmaking", d: "Turning moments into stories.", c: "#e0654a", img: "/side/filmmaking.jpg" },
  { t: "Chess", d: "Learning to think before moving.", c: "#8c8a85", img: "/side/chess.jpg" },
  { t: "Books", d: "Literature, philosophy, history, psychology and anything that makes me think differently.", c: "#7a4bd1", img: "/side/books.jpg" },
];

export const NOW: [string, string][] = [
  ["Building", "AI and systems projects"], ["Learning", "Advanced C++, system design"], ["Reading", "Philosophy and history"],
  ["Watching", "Films and anime worth studying"], ["Creating", "Video and photography"], ["Playing", "Chess"], ["Exploring", "New places"],
];

export const ABOUT = [
  "I'm Aryan, an engineer interested in AI, software systems and building things that are actually useful.",
  "Outside engineering, I spend an unreasonable amount of time thinking about philosophy, psychology, films, photography, history and whatever else catches my curiosity.",
  "I like learning difficult things, making things from scratch and occasionally disappearing somewhere with a camera.",
];

// If your About photo shows sideways, set this to 90 (or 270, 180). Use 0 once the photo file itself is upright.
export const ABOUT_ROTATE = 90;