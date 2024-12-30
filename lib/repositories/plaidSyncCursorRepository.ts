// import prisma from '../prisma/client'

// class PlaidSyncCursorRepository {
//    // create should be used the first time to create a row when the access token is received.
//     async create(userId: string, itemId: string, accessToken: string) {
//       await prisma.plaidSyncCursor.upsert({
//           where: { itemId },
//           update: { accessToken },
//           create: {
//               userId,
//               itemId,
//               accessToken,
//           },
//       });
//     }

//     async getItemIdsForUser(userId: string): Promise<string[]> {
//         const items = await prisma.plaidSyncCursor.findMany({
//             where: { userId },
//             select: { itemId: true },
//         });
//         return items.map(item => item.itemId);
//     }

//     async getSyncData(itemId: string) {
//         return await prisma.plaidSyncCursor.findUnique({
//             where: { itemId },
//             select: { accessToken: true, cursor: true },
//         });
//     }

//     async updateCursor(itemId: string, newCursor: string) {
//         return await prisma.plaidSyncCursor.update({
//             where: { itemId },
//             data: {
//                 cursor: newCursor,
//                 lastSyncedAt: new Date(),
//             },
//         });
//     }

//     async refreshAccessToken(itemId: string, newAccessToken: string) {
//         return await prisma.plaidSyncCursor.update({
//             where: { itemId },
//             data: {
//                 accessToken: newAccessToken,
//                 lastSyncedAt: new Date(),
//             },
//         });
//     }
// }

// export const plaidSyncCursorRepository = new PlaidSyncCursorRepository();
