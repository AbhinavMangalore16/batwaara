import { AnimatedTestimonials } from "../animated-testimonials";
import { TestimonialTitle } from "./TestimonialTitle";

export const CustomTestimonies = () =>{
const testimonials = [
    {
      quote:
        "Living with 3 others used to mean endless 'who paid for milk?' texts. Batwara just handles it. We don't even talk about money anymore, we just settle up.",
      name: "Rohan & Flatmates",
      designation: "Students, Mumbai",
      src: "https://i.pinimg.com/474x/48/f9/3b/48f93b19a6d6b18a83d2fa41b14e417d.jpg",
    },
    {
      quote:
        "Took a trip to Manali with 8 friends. The debt graph is genius—it turned 40 messy transactions into just 3 transfers. I actually enjoyed being the treasurer for once.",
      name: "Ananya S.",
      designation: "Travel Enthusiast, Bangalore",
      src: "https://m.media-amazon.com/images/M/MV5BMDc1NDE3NDgtZGI5MC00MDhlLWI2NDgtNGIxZGUwMWNmYTY3XkEyXkFqcGc@._V1_.jpg",
    },
    {
      quote:
        "I hate typing out bills. The AI scanner is legit—I snap a picture of a long dinner receipt and it itemizes everything automatically. Huge time saver.",
      name: "Vikram D.",
      designation: "Freelancer, Delhi",
      src: "https://upload.wikimedia.org/wikipedia/commons/f/fe/EIk22BhUYAEF_k3.jpg",
    },
    {
      quote:
        "My partner and I use it for everything from groceries to rent. It’s not about being stingy, it’s about transparency. No more 'I paid last time' arguments.",
      name: "Andrea & Sam",
      designation: "Product Designers, Frankfurt",
      src: "https://img.freepik.com/free-photo/medium-shot-smiley-couple-couch_23-2149145063.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      quote:
        "Ordering lunch for the team is no longer a headache. I just log it, split it by 'exact amounts' for the picky eaters, and send the request. Done.",
      name: "Arjun K.",
      designation: "Team Lead, Hyderabad",
      src: "https://in.bmscdn.com/iedb/artist/images/website/poster/large/allu-arjun-125-03-10-2016-01-55-06.jpg",
    },
  ];
  return (
    <div>
      <AnimatedTestimonials testimonials={testimonials} autoplay/>
    </div>
)
}