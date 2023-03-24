---
id: t40ya
title: "Prisma SQL Schema "
file_version: 1.1.2
app_version: 1.4.7
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
18     model User {
19       id String @id @default(uuid())
20     
21       createdAt DateTime @default(now())
22       updatedAt DateTime @updatedAt
23       deletedAt DateTime?
24     
25       firstName String 
26       lastName String
27       email String @unique
28       hashedPassword String?
29       image String?
30     
31       role RoleEnum @default(USER)
32       
33       sessions Session[]
34       accounts Account[]
35       kitchenRole KitchenUser?
36       chefRole ChefUser?
37     }
```

<br/>

## Kitchen & Chef User Profiles
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
54     model KitchenUser {
55       id String @id @default(uuid())
56       createdAt DateTime @default(now())
57       updatedAt DateTime @updatedAt
58       deletedAt DateTime?
59     
60       status UserStatus @default(PENDING)
61     
62       // Credit Info
63       accountCredits Int @default(0)
64     
65       // Reviews on Chefs Portfolios
66       chefReviews ChefReviews[]
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
216      iconImage String?
217      status String?
218      required Boolean @default(false)
219    
220      kitchenEquipment KitchenEquipment[]
221    }
```

<br/>

# Chefs

<br/>

## Chef Company Details
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
232    model ChefCompanyDetails {
233      id String @id @default(uuid())
234      createdAt DateTime @default(now())
235      updatedAt DateTime @updatedAt
236      deletedAt DateTime?
237      name String
238      description String
239      phone String
240      website String?
241      status ChefStatus @default(PENDING)
242    
243      // Time Slots Selected
244      timeSlots TimeSlot[]
245    
246      // Location Data
247      address String
248    
249      cityId String
250      city City @relation(fields: [cityId], references: [id])
251    
252      stateId String
253      state State @relation(fields: [stateId], references: [id])
254    
255      countryId String
256      country Country @relation(fields: [countryId], references: [id])
257    
258      zip String
259      lat String?
260      lon String?
261    
262      // Chefs Allowed in Kitchen
263      kitchensAllowed Int?
264    
265      // Chef Reviews
266      chefReviews ChefReviews[]
267    
268      // Kitchen Reviews
269      kitchenReviews KitchenReviews[]
270    
271      // Chef Owner 
272      ownerId String 
273      chefOwner ChefUser @relation(fields: [ownerId], references: [id], onDelete: Cascade)
274    
275      chefMedia Media[]
276    
277      chefEquipment ChefEquipment?
278    }
```

<br/>

# Location Data

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
304    model City {
305      id String @id @default(uuid())
306      name String
307      status String
308    
309      stateId String
310      state State @relation(fields: [stateId], references: [id], onDelete: Cascade)
311    
312      kitchenDetails KitchenDetails[]
313      chefDetails ChefCompanyDetails[]
314    }
315    
316    model State {
317      id String @id @default(uuid())
318      name String
319      code String
320      status String
321    
322      city City[]
323    
324      countryId String
325      country Country @relation(fields: [countryId], references: [id], onDelete: Cascade)
326    
327      kitchenDetails KitchenDetails[]
328      chefDetails ChefCompanyDetails[]
329    }
330    
331    model Country {
332      id String @id @default(uuid())
333      name String
334      code String
335      status String
336    
337      state State[]
338    
339      kitchenDetails KitchenDetails[]
340      chefDetails ChefCompanyDetails[]
341    }
```

<br/>

# Reviews

<br/>

## Kitchen and Chefs Reviews
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
344    model KitchenReviews {
345      id String @id @default(uuid())
346      createdAt DateTime @default(now())
347      updatedAt DateTime @updatedAt
348      deletedAt DateTime?
349    
350      review String
351      rating Int
352    
353      kitchenDetailsId String
354      kitchenDetails KitchenDetails @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
355    
356      chefId String
357      chef ChefCompanyDetails @relation(fields: [chefId], references: [id], onDelete: Cascade)
358    }
359    
360    model ChefReviews {
361      id String @id @default(uuid())
362      createdAt DateTime @default(now())
363      updatedAt DateTime @updatedAt
364      deletedAt DateTime?
365    
366      review String
367      rating Int
368    
369      chefDetailsId String
370      chef ChefCompanyDetails @relation(fields: [chefDetailsId], references: [id], onDelete: Cascade)
371    
372      kitchenUserId String
373      kitchenUser KitchenUser @relation(fields: [kitchenUserId], references: [id], onDelete: Cascade)
374    }
375    
```

<br/>

# Media

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
377    // Media Models: Certificates, Media, etc.
378    model Certificates {
379      id String @id @default(uuid())
380      createdAt DateTime @default(now())
381      updatedAt DateTime @updatedAt
382      deletedAt DateTime?
383      fileName String
384      fileSize BigInt 
385      fileUrl String
386      fileType String
387    
388      kitchenDetailsId String?
389      kitchenDetails KitchenDetails? @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
390    
391      chefDetailsId String?
392      chefDetails ChefUser? @relation(fields: [chefDetailsId], references: [id], onDelete: Cascade)
393    }
394    
395    model Media {
396      id String @id @default(uuid())
397      createdAt DateTime @default(now())
398      updatedAt DateTime @updatedAt
399      deletedAt DateTime?
400      fileName String
401      fileSize BigInt 
402      fileUrl String
403      fileType String
404    
405      kitchenDetailsId String?
406      kitchenDetails KitchenDetails? @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
407    
408      chefDetailsId String?
409      chefDetails ChefCompanyDetails? @relation(fields: [chefDetailsId], references: [id], onDelete: Cascade)
410    }
```

<br/>

# Booking Models

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
421    // Create model of a time slot
422    model TimeSlot {
423      id String @id @default(uuid())
424      createdAt DateTime @default(now())
425      updatedAt DateTime @updatedAt
426      deletedAt DateTime?
427    
428      // Cost Details
429      creditCost Int
430      creditPaid Int?
431      isPaid Boolean @default(false)
432      isRefunded Boolean @default(false)
433      refundReason String?
434      refundDate DateTime?
435      refundAmount Int?
436    
437      // Time Slot Details
438      timeSlotDate DateTime
439      startTime DateTime
440      endTime DateTime
441      timeSlotDuration Int
442      timeSlotType String?
443      timeSlotNotes String?
444      timeSlotStatus TimeSlotStatus @default(AVAILABLE)
445    
446      timeZone String?
447      canceledDate DateTime?
448      rejectedDate DateTime?
449      cancelationReasons String?
450      rejectionReason String?
451    
452      // Chef Selecting Time Slot
453      chefId String?
454      chef ChefCompanyDetails? @relation(fields: [chefId], references: [id])
455    
456      chefsAttending Int
457    
458    
459      // Time Slot Kitchen Details
460      kitchenDetailsId String
461      kitchenDetails KitchenDetails @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
462    }
```

<br/>

# Credits Models

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
470    model CreditPackages {
471      id String @id @default(uuid())
472      createdAt DateTime @default(now())
473      updatedAt DateTime @updatedAt
474      deletedAt DateTime?
475    
476      name String
477      description String
478      creditsGranted Int
479      pricePerCredit Decimal
480      totalPrice Decimal
481      status CreditStatus @default(ACTIVE)
482    
483      creditBought BoughtCredits[]
484    }
485    
486    model BoughtCredits {
487      id String @id @default(uuid())
488      createdAt DateTime @default(now())
489      updatedAt DateTime @updatedAt
490      deletedAt DateTime?
491    
492      creditsBought Int
493      transactoinId String @default(uuid())
494    
495      // Credit Package Details
496      creditPackageId String
497      creditPackage CreditPackages @relation(fields: [creditPackageId], references: [id], onDelete: Cascade)
498    
499      // Chef Details
500      chefId String
501      chef ChefUser @relation(fields: [chefId], references: [id], onDelete: Cascade)
502    
503      // Payment Details
504      paymentId String
505      payment Payment @relation(fields: [paymentId], references: [id], onDelete: Cascade)
506    }
```

<br/>

# Payment Model

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
508    model Payment {
509      id String @id @default(uuid())
510      createdAt DateTime @default(now())
511      updatedAt DateTime @updatedAt
512      deletedAt DateTime?
513    
514      // Payment Details
515      paymentId String
516      paymentMethod String
517      paymentStatus String
518      paymentAmount Decimal
519      paymentCurrency String
520      paymentDate DateTime
521      paymentNotes String?
522    
523      // Payment Details
524      chefId String
525      chef ChefUser @relation(fields: [chefId], references: [id], onDelete: Cascade)
526    
527      creditsBought BoughtCredits[]
528    }
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](/repos/Z2l0aHViJTNBJTNBZm9vZHZhdWx0LWFwaSUzQSUzQWZvb2R2YXVsdC1pbw==/docs/t40ya).
