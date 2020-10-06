import axios from "axios";
import { PSRs } from "../utils/psr";


async function loadTellorPrices(priceResults, priceIds) {

   try {

    const priceAPIPromises = [];

     priceIds.forEach(id => {
       priceAPIPromises.push(
         new Promise((resolve, reject) => {
           axios.get(`http://api.tellorscan.com/price/${id}`).then((res) => {
             resolve(res);
           });
         })
       );
     });

     return Promise.all(priceAPIPromises).then((values) => {

       const rawPrices = [...values.map(value => value.data)];
       rawPrices.map((priceObj, index) => {
         console.log(priceObj.value, PSRs[priceIds[index]].granularity, +parseInt(priceObj.value) / +parseInt(PSRs[priceIds[index]].granularity));
         priceResults[PSRs[priceIds[index]].name] =
           +parseInt(priceObj.value) / +parseInt(PSRs[priceIds[index]].granularity);
       });
     });

   } catch (e) {
     console.error(e);
   }
 }




 export {
     loadTellorPrices
 };
