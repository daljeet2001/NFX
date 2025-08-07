// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type Order = {
//   order_id: string;
//   user_id: string;
//   market: string;
//   side: string;
//   price: string;
//   quantity: string;
//   executed_qty: string;
//   timestamp: string;
// };

// export const Orders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);

//   useEffect(() => {
//     fetch("http://localhost:3000/api/v1/klines/orders")
//       .then((res) => res.json())
//       .then((data) => setOrders(data));
//   }, []);

//   return (
//     <div className="flex flex-col flex-1 max-w-[1280px] w-full">
//       <div className="flex flex-col min-w-[700px] flex-1 w-full">
//         <div className="flex flex-col w-full rounded-lg bg-baseBackgroundL1 px-5 py-3">
//           <table className="w-full table-auto">
//             <OrderHeader />
//             <tbody>
//               {orders.map((order) => (
//                 <OrderRow key={order.order_id} order={order} />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// function OrderRow({ order }: { order: Order }) {
//   const router = useRouter();
//   return (
//     <tr
//       className="cursor-pointer border-t border-baseBorderLight hover:bg-white/7 w-full"
//     >
//       <td className="px-1 py-3">
//         <div className="flex shrink">
//           <div className="flex items-center">
//             <div
//               className="relative flex-none overflow-hidden rounded-full border border-baseBorderMed"
//               style={{ width: "40px", height: "40px" }}
//             >
//               <div className="relative">
//                 <img
//                   alt={order.market}
//                   src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAkx6l7_33DOWaOeO6evirSAaaqq2jM4G59Q&s"
//                   loading="lazy"
//                   width="40"
//                   height="40"
//                 />
//               </div>
//             </div>
//             <div className="ml-4 flex flex-col">
//               <p className="whitespace-nowrap text-base font-medium text-baseTextHighEmphasis">
//                 {order.market}
//               </p>
//               <p className="text-xs text-baseTextMedEmphasis">{order.side}</p>
//             </div>
//           </div>
//         </div>
//       </td>
//       <td className="px-1 py-3 text-base font-medium tabular-nums">{order.price}</td>
//       <td className="px-1 py-3 text-base font-medium tabular-nums">{order.quantity}</td>
//       <td className="px-1 py-3 text-base font-medium tabular-nums">{order.executed_qty}</td>
//       <td className="px-1 py-3 text-base font-medium tabular-nums">{new Date(order.timestamp).toLocaleString()}</td>
//     </tr>
//   );
// }

// function OrderHeader() {
//   return (
//     <thead>
//       <tr>
//         <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">
//           <div className="flex items-center gap-1 cursor-pointer select-none">
//             Market
//           </div>
//         </th>
//         <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">
//           Price
//         </th>
//         <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">
//           Quantity
//         </th>
//         <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">
//           Executed
//         </th>
//         <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">
//           Time
//         </th>
//       </tr>
//     </thead>
//   );
// }
