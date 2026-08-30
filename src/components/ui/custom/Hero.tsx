"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { Highlight } from "../hero-highlight";
import { SignUpButton, useUser } from "@clerk/nextjs";

export function Hero() {
  const { isSignedIn } = useUser();

  const images = [
    "https://img.freepik.com/free-photo/nomad-family-living-nature_23-2149431664.jpg?semt=ais_hybrid&w=740&q=80",
    "https://www.spoton.com/blog/content/images/2021/12/How-Payment-Technology-Is-Revolutionizing-the-Bar-Tab.jpg",
    "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFtaWx5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D",
    "https://www.itandcoffee.com.au/uploads/1/1/7/8/11786991/pay-friend-3_orig.jpg",
    "https://media.baamboozle.com/uploads/images/508542/1633732968_42653.jpeg",
    "https://fi.money/content/guides/3_1_1d61c0f9bc-38075a56.webp",
    "https://payperless.com/sites/default/files/2022-03/How%20will%20cryptocurrency%20affect%20the%20mobile%20payment%20market_Preview.jpg",
    "https://thumbs.dreamstime.com/b/boyfriend-checking-restaurant-bill-date-man-paying-romantic-diner-his-girlfriend-ignores-check-85665029.jpg",
    "https://thumbs.dreamstime.com/b/boyfriend-checking-restaurant-bill-date-man-paying-romantic-diner-his-girlfriend-ignores-check-85665029.jpg",
    "https://assets.aceternity.com/carousel.webp",
    "https://img.freepik.com/premium-photo/indian-couple-enjoying-restaurant-date-laughing-together-terrace-boyfriend_868783-43183.jpg?w=360",
    "https://runway-media-production.global.ssl.fastly.net/us/originals/2022/11/tourist-paying-bill-with-credit-card-in-barcelona-restaurant_-martin-dm.jpg",
    "https://assets.smfgindiacredit.com/sites/default/files/Budget-Friendly-Family-Trip.jpg?VersionId=Qb0Kl6Gq5tF299YmGLw23WZhjo9r5B9o",
    "https://cdn.shopify.com/s/files/1/0072/4641/3922/files/Reignite-the-spark-in-your-relationship-with-weekly-date-nights-the-adventure-challange-1_1024x1024.jpg?v=1682586096",
    "https://media.istockphoto.com/id/1367208496/photo/happy-family-and-kids-with-travel-suitcase-buying-ticket-booking-hotel-online.jpg?s=612x612&w=0&k=20&c=jXtsnyZzjv4zLViT6-supq_NWhyf76NTVTJXbZsxVf4=",
    "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ingi9.IQomj8/v1/-1x-1.webp",
    "https://blog.payableapps.com/wp-content/uploads/2023/08/templates-free-for-teachers-1-850x478.jpg",
    "https://academy.wetravel.com/hs-fs/hubfs/Imported_Blog_Media/Group-Travel-1-1-Sep-14-2023-02-01-38-6128-PM.jpg",
    "https://indiathrills.com/wp-content/uploads/2022/03/3rkhc5wxof9kmokdky067faduyh8_shutterstock_1115156795.jpg",
    "https://www.shutterstock.com/shutterstock/videos/3423175745/thumb/1.jpg?ip=x480",
    "https://blog.payableapps.com/wp-content/uploads/2023/08/templates-free-for-teachers-1-850x478.jpg",
    "https://image.cnbcfm.com/api/v1/image/106914645-1626896911341-gettyimages-1209019388-3q4a6002.jpeg?v=1626897196&w=720&h=405",
    "https://www.abc4.com/wp-content/uploads/sites/4/2022/12/GettyImages-1372549650.jpg?w=2560&h=1440&crop=1",
    "https://images.cnbctv18.com/uploads/2025/03/travel-tips-2-2025-03-ae727060319d9bc40966b0e741fc2e65.jpg?impolicy=website&width=400&height=225",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF6HJDMkVshP-rsqUtFfR9B6nuW6oP8XtlAg&s",
    "https://assets.aceternity.com/macbook-scroll.png",
    "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
    "https://www.thetravelbuglife.com/wp-content/uploads/2022/06/plan-travel-with-friends-1.jpg",
    "https://enjoytravellife.com/wp-content/uploads/2021/04/happy-family-road-trip-lg-1024x683.jpg",
    "https://www.thetravelbuglife.com/wp-content/uploads/2022/06/plan-travel-with-friends-1.jpg",
    "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_center,w_730,h_487/cb%2FEmail%2Fissue-34%2Fcb34_roadtrip_tips",
    "https://miro.medium.com/1*6D9Dy-yE7EfCermiI5rIWA.jpeg",
  ];
  return (
    <div className="relative my-10 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <h2 className="relative z-20 w-full px-6 text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
        The smartest way to {" "}
        <Highlight className="text-white">
          split payments!
        </Highlight>
      </h2>
      <p className="relative z-20 w-full px-6 py-8 text-center text-sm text-neutral-200 md:text-base">
        Batwara handles the math so you can focus on the moment.
      </p>

      <div className="relative z-30 pointer-events-auto flex flex-wrap items-center justify-center gap-4 pt-4">
        {isSignedIn ? (
          <a
            href="/dashboard"
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 cursor-pointer font-space inline-block"
          >
            Go to Dashboard &rarr;
          </a>
        ) : (
          <SignUpButton mode="modal">
            <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 cursor-pointer font-space">
              Get Started
            </button>
          </SignUpButton>
        )}
        <a
          href="#features"
          className="rounded-xl border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10 cursor-pointer font-space inline-block"
        >
          See Demo
        </a>
      </div>

      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-[#090d16]/80" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images}
      />
    </div>
  );
}
