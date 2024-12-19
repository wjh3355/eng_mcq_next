import checkAdminUserAuth from "@/serverFuncs/checkAdminUserAuth";

const ppp = "For the elderly in Singapore, Covid-19 has caused them to be detached from their normal lives. As they are a vulnerable group, the circuit breaker {rules} were particularly strict. Frequently visited public spaces {like} community clubs, markets and hawker centres were shut. Their leisure options at home are {limited} to watching the television and listening to the radio, or chatting with their friends on the phone.||The Senior Go Digital training programme was launched to help the elderly {cope} with the challenge. The digital training {consists} of communication skills like video calls, connecting to WiFi, and basic cyber security tips. The workshops are run on in environments the elderly are {familiar} with such as community clubs and libraries. They are supported by volunteers who work as digital ambassadors to {teach} the elderly one-on-one or in small groups. The elderly often feel assured {as} it was safe and conducive.||Madam Farah is a 60-year-old full-time homemaker. Although she only picked up basic computer skills recently, juggling household chores {with/and} social media platforms such as Zoom and Instagram has {become} second nature. She admits that seniors like herself may often feel reluctant to step out of their {comfort} zone. However, she embraced the challenge as she was {motivated} by curiosity and a desire to learn more. She was also encouraged by the government's efforts to support {senior} citizens like her.||Madam Farah uses Instagram {frequently} to update her posts for her followers and volunteers at the community club, who look forward to her updates everyday. They were unable to meet during the circuit breaker, but social media {helped} them remain connected on a digital level. Digital technology is indeed empowering.";

export const dynamic = 'force-dynamic';

export default async function $() {

   await checkAdminUserAuth();

   const wordsToTest = ppp
      .match(/\{[^}]*\}/g)!
      .map(match => match
         .slice(1, -1)
         .split("/")
         .filter(Boolean)
      )

   const fooooooo = ppp
      .replace(/{.*?}/g, "BLANK")
      .split(/(BLANK|\|\|)/)
      .filter(Boolean)
   
   const garbage: (string | React.JSX.Element)[][] = (() => {
      let blankCountr = 0;

      let formattedParagraphs: (string | React.JSX.Element)[][] = [];
      let currArray: (string | React.JSX.Element)[] = [];

      for (let item of fooooooo) {

         if (item === "||") {
            formattedParagraphs.push(currArray);
            currArray = [];
         } else if (item === "BLANK") {

            currArray.push(
               <span key={blankCountr} className="fw-bold text-info">({blankCountr+1}){wordsToTest[blankCountr].join("/")}</span>
            );
            blankCountr++;

         } else {
            currArray.push(item);
         }
      }
      
      formattedParagraphs.push(currArray);

      return formattedParagraphs;

   })()

   return (
      <div>
         <pre>
            {JSON.stringify(fooooooo)}
         </pre>
         {
            garbage.map((thing, idx) =>
               <p key={idx}>{thing}</p>
            )
         }
      </div>
   );
}