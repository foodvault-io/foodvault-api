---
id: t40ya
title: "Prisma SQL Schema "
file_version: 1.1.2
app_version: 1.4.6
---

This document will highlight the different Prisma models and the relationship between them

<br/>

<div align="center"><img src="https://media2.giphy.com/media/JWuBH9rCO2uZuHBFpm/giphy.gif?cid=d56c4a8bv6oal8d3cjsq1s79e0iugkdc1d2bl5w87czxp0av&rid=giphy.gif&ct=g" style="width:'50%'"/></div>

<br/>

<br/>

# Users

<br/>

## User Profile
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
21     model User {
22       id String @id @default(uuid())
23     
24       createdAt DateTime @default(now())
25       updatedAt DateTime @updatedAt
26       deletedAt DateTime?
27     
28       firstName String 
29       lastName String
30       email String @unique
31       hashedPassword String?
32       image String?
33     
34       role RoleEnum @default(USER)
35       
36       sessions Session[]
37       accounts Account[]
38       kitchenRole KitchenUser?
39       chefRole ChefUser?
40     }
```

<br/>

## Kitchen & Chef User Profiles
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
57     model KitchenUser {
58       id String @id @default(uuid())
59       createdAt DateTime @default(now())
60       updatedAt DateTime @updatedAt
61       deletedAt DateTime?
62     
63       status UserStatus @default(PENDING)
64     
65       // Credit Info
66       accountCredits Int @default(0)
67     
68       userId String @unique
69       user User @relation(fields: [userId], references: [id], onDelete: Cascade)
70     
71       kitchenDetails KitchenDetails[]
72     }
73     
74     model ChefUser {
75       id String @id @default(uuid())
76       createdAt DateTime @default(now())
77       updatedAt DateTime @updatedAt
78       deletedAt DateTime?
79     
80       status UserStatus @default(PENDING)
81     
82       // Chef Certificates & identification
83       certificates Certificates[]
84     
85       // Credit Info
86       accountCredits Int @default(0)
87       purchaseDate DateTime?
88       creditPackage BoughtCredits[]
89     
90       userId String @unique
91       user User @relation(fields: [userId], references: [id], onDelete: Cascade)
92     
93       chefDetails ChefCompanyDetails[]
94       payments Payment[]
95     }
```

<br/>

# Authorization/Authentication

<br/>

## Account, Session, VerificationToken
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
97     model Account {
98       id String @id @default(uuid())
99     
100      userId String 
101      user User @relation(fields: [userId], references: [id], onDelete: Cascade)
102    
103    
104      providerType String @default("local")
105      provider String @default("local")
106      providerAccountId String 
107    
108      refreshToken String?
109      accessToken String?
110      accessTokenExpires Int?
111      tokenType String?
112      scope String?
113      idToken String?
114      sessionState String?
115    
116      @@unique([provider, providerAccountId])
117    }
118    
119    model Session {
120      id String @id @default(uuid()) 
121      sessionToken String @unique 
122      expires DateTime
123    
124      userId String
125      user User @relation(fields: [userId], references: [id], onDelete: Cascade)
126    }
127    
128    model VerificationToken {
129      identifier String 
130      token String @unique
131      expires DateTime
132      createdAt DateTime @default(now())
133      updatedAt DateTime @updatedAt
134    
135      @@unique([identifier, token])
136    }
```

<br/>

# Kitchens

<br/>

## Kitchen Details, Kitchen Equipment, Kitchen Amenities
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
148    model KitchenDetails {
149      // Kitchen Details
150      id String @id @default(uuid())
151      createdAt DateTime @default(now())
152      updatedAt DateTime @updatedAt
153      deletedAt DateTime?
154    
155      // Kitchen Details
156      name String @unique
157      description String
158      phone String
159      website String?
160      status KitchenStatus @default(PENDING) 
161    
162      // Time Slots
163      timeSlots TimeSlot[]
164      totalCreditsReceived Int @default(0) // Total Credits Received from Chefs for Bookings
165    
166      // Location Data
167      address String
168    
169      cityId String
170      city City @relation(fields: [cityId], references: [id])
171    
172      stateId String
173      state State @relation(fields: [stateId], references: [id])
174    
175      countryId String
176      country Country @relation(fields: [countryId], references: [id])
177    
178      zip String
179      lat String?
180      lon String?
181    
182      // Kitchen Certificates & identification
183      certificates Certificates[]
184    
185      // Chefs Allowed in Kitchen
186      chefsAllowed Int?
187    
188      // Kitchen Reviews
189      kitchenReviews KitchenReviews[]
190      
191      // Kitchen Owner 
192      ownerId String @unique
193      kitchenOwner KitchenUser @relation(fields: [ownerId], references: [id], onDelete: Cascade)
194    
195      equipmentList KitchenEquipment?
196      additionalEquipment String?
197    
198      kitchenMedia Media[]
199    }
200    
201    model KitchenEquipment {
202      id String @id @default(uuid())
203      createdAt DateTime @default(now())
204      updatedAt DateTime @updatedAt
205      deletedAt DateTime?
206    
207      amenities KitchenAmenities[]
208    
209      kitchenDetailsId String @unique
210      kitchenDetails KitchenDetails @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
211    }
212    
213    model KitchenAmenities{
214      id String @id @default(uuid())
215      name String
216      iconImage String
217      status String
218    
219      kitchenEquipment KitchenEquipment[]
220    }
```

<br/>

# Chefs

<br/>

## Chef Company Details
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
231    model ChefCompanyDetails {
232      id String @id @default(uuid())
233      createdAt DateTime @default(now())
234      updatedAt DateTime @updatedAt
235      deletedAt DateTime?
236      name String
237      description String
238      phone String
239      website String?
240      status ChefStatus @default(PENDING)
241    
242      // Time Slots Selected
243      timeSlots TimeSlot[]
244    
245      // Location Data
246      address String
247    
248      cityId String
249      city City @relation(fields: [cityId], references: [id])
250    
251      stateId String
252      state State @relation(fields: [stateId], references: [id])
253    
254      countryId String
255      country Country @relation(fields: [countryId], references: [id])
256    
257      zip String
258      lat String?
259      lon String?
260    
261      // Chefs Allowed in Kitchen
262      kitchensAllowed Int?
263    
264      // Chef Reviews
265      chefReviews ChefReviews[]
266    
267      // Kitchen Reviews
268      kitchenReviews KitchenReviews[]
269    
270      // Chef Owner 
271      ownerId String 
272      chefOwner ChefUser @relation(fields: [ownerId], references: [id], onDelete: Cascade)
273    
274      chefMedia Media[]
275    }
```

<br/>

# Location Data

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
279    model City {
280      id String @id @default(uuid())
281      name String
282      status String
283    
284      stateId String
285      state State @relation(fields: [stateId], references: [id], onDelete: Cascade)
286    
287      kitchenDetails KitchenDetails[]
288      chefDetails ChefCompanyDetails[]
289    }
290    
291    model State {
292      id String @id @default(uuid())
293      name String
294      code String
295      status String
296    
297      city City[]
298    
299      countryId String
300      country Country @relation(fields: [countryId], references: [id], onDelete: Cascade)
301    
302      kitchenDetails KitchenDetails[]
303      chefDetails ChefCompanyDetails[]
304    }
305    
306    model Country {
307      id String @id @default(uuid())
308      name String
309      code String
310      status String
311    
312      state State[]
313    
314      kitchenDetails KitchenDetails[]
315      chefDetails ChefCompanyDetails[]
316    }
```

<br/>

# Reviews

<br/>

## Kitchen and Chefs Reviews
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
319    model KitchenReviews {
320      id String @id @default(uuid())
321      createdAt DateTime @default(now())
322      updatedAt DateTime @updatedAt
323      deletedAt DateTime?
324    
325      review String
326      rating Int
327    
328      kitchenDetailsId String
329      kitchenDetails KitchenDetails @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
330    
331      chefId String
332      chef ChefCompanyDetails @relation(fields: [chefId], references: [id], onDelete: Cascade)
333    }
334    
335    model ChefReviews {
336      id String @id @default(uuid())
337      createdAt DateTime @default(now())
338      updatedAt DateTime @updatedAt
339      deletedAt DateTime?
340    
341      review String
342      rating Int
343    
344      chefDetailsId String
345      chef ChefCompanyDetails @relation(fields: [chefDetailsId], references: [id], onDelete: Cascade)
346    
347      kitchenDetailsId String
348      
349    }
```

<br/>

# Media

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
352    // Media Models: Certificates, Media, etc.
353    model Certificates {
354      id String @id @default(uuid())
355      createdAt DateTime @default(now())
356      updatedAt DateTime @updatedAt
357      deletedAt DateTime?
358      fileName String
359      fileSize BigInt 
360      fileUrl String
361      fileType String
362    
363      kitchenDetailsId String?
364      kitchenDetails KitchenDetails? @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
365    
366      chefDetailsId String?
367      chefDetails ChefUser? @relation(fields: [chefDetailsId], references: [id], onDelete: Cascade)
368    }
369    
370    model Media {
371      id String @id @default(uuid())
372      createdAt DateTime @default(now())
373      updatedAt DateTime @updatedAt
374      deletedAt DateTime?
375      fileName String
376      fileSize BigInt 
377      fileUrl String
378      fileType String
379    
380      kitchenDetailsId String?
381      kitchenDetails KitchenDetails? @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
382    
383      chefDetailsId String?
384      chefDetails ChefCompanyDetails? @relation(fields: [chefDetailsId], references: [id], onDelete: Cascade)
385    }
```

<br/>

# Booking Models

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
396    // Create model of a time slot
397    model TimeSlot {
398      id String @id @default(uuid())
399      createdAt DateTime @default(now())
400      updatedAt DateTime @updatedAt
401      deletedAt DateTime?
402    
403      // Cost Details
404      creditCost Int
405      creditPaid Int?
406      isPaid Boolean @default(false)
407      isRefunded Boolean @default(false)
408      refundReason String?
409      refundDate DateTime?
410      refundAmount Int?
411    
412      // Time Slot Details
413      timeSlotDate DateTime
414      startTime DateTime
415      endTime DateTime
416      timeSlotDuration Int
417      timeSlotType String?
418      timeSlotNotes String?
419      timeSlotStatus TimeSlotStatus @default(AVAILABLE)
420    
421      timeZone String?
422      canceledDate DateTime?
423      rejectedDate DateTime?
424      cancelationReasons String?
425      rejectionReason String?
426    
427      // Chef Selecting Time Slot
428      chefId String?
429      chef ChefCompanyDetails? @relation(fields: [chefId], references: [id])
430    
431      chefsAttending Int
432    
433    
434      // Time Slot Kitchen Details
435      kitchenDetailsId String
436      kitchenDetails KitchenDetails @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
437    }
```

<br/>

# Credits Models

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
445    model CreditPackages {
446      id String @id @default(uuid())
447      createdAt DateTime @default(now())
448      updatedAt DateTime @updatedAt
449      deletedAt DateTime?
450    
451      name String
452      description String
453      creditsGranted Int
454      pricePerCredit Decimal
455      totalPrice Decimal
456      status CreditStatus @default(ACTIVE)
457    
458      creditBought BoughtCredits[]
459    }
460    
461    model BoughtCredits {
462      id String @id @default(uuid())
463      createdAt DateTime @default(now())
464      updatedAt DateTime @updatedAt
465      deletedAt DateTime?
466    
467      creditsBought Int
468      transactoinId String @default(uuid())
469    
470      // Credit Package Details
471      creditPackageId String
472      creditPackage CreditPackages @relation(fields: [creditPackageId], references: [id], onDelete: Cascade)
473    
474      // Chef Details
475      chefId String
476      chef ChefUser @relation(fields: [chefId], references: [id], onDelete: Cascade)
477    
478      // Payment Details
479      paymentId String
480      payment Payment @relation(fields: [paymentId], references: [id], onDelete: Cascade)
481    }
```

<br/>

# Payment Model

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
483    model Payment {
484      id String @id @default(uuid())
485      createdAt DateTime @default(now())
486      updatedAt DateTime @updatedAt
487      deletedAt DateTime?
488    
489      // Payment Details
490      paymentId String
491      paymentMethod String
492      paymentStatus String
493      paymentAmount Decimal
494      paymentCurrency String
495      paymentDate DateTime
496      paymentNotes String?
497    
498      // Payment Details
499      chefId String
500      chef ChefUser @relation(fields: [chefId], references: [id], onDelete: Cascade)
501    
502      creditsBought BoughtCredits[]
503    }
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](/repos/Z2l0aHViJTNBJTNBZm9vZHZhdWx0LWFwaSUzQSUzQWZvb2R2YXVsdC1pbw==/docs/t40ya).
