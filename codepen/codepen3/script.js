gsap.set("li > span", {transformOrigin:"0 50%"})
gsap.set("li:not(:first-of-type) span", {opacity:0.2, scale:0.8})

const tl = gsap.timeline()
	.to("li:not(:first-of-type) span", 
		 {opacity:1, scale:1, stagger:0.5}
		)
   .to("li:not(:last-of-type) span", 
		 {opacity:0.2, scale:0.8, stagger:0.5}, 0)


ScrollTrigger.create({
	trigger:"h1", 
	start:"center center",
	endTrigger:"li:last-of-type",
	end:"center center",
	pin:true,
	markers:true,
	animation:tl,
	scrub:true
}) 

/* learn to master all aspects of GSAP

unlock over 250 premium video tutorials to take you from beginner to pro

https://www.creativecodingclub.com/bundles/creative-coding-club
*/