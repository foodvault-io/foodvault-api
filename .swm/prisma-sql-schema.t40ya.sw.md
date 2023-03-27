---
id: t40ya
title: "Prisma SQL Schema "
file_version: 1.1.2
app_version: 1.5.0
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
110      accessTokenExpires Int? // In minutes
111      tokenType String?
112    
113      @@unique([provider, providerAccountId])
114    }
115    
116    model Session {
117      id String @id @default(uuid()) 
118      sessionToken String @unique 
119      expires DateTime
120    
121      userId String
122      user User @relation(fields: [userId], references: [id], onDelete: Cascade)
123    }
124    
125    model VerificationToken {
126      identifier String 
127      token String @unique
128      expires DateTime
129      createdAt DateTime @default(now())
130      updatedAt DateTime @updatedAt
131    
132      @@unique([identifier, token])
133    }
134    
135    // Kitchen Models: Kitchen Details, Kitchen Equipment, Kitchen Amenities, Kitchen Time Slots
136    
137    enum KitchenStatus {
138      ACTIVE @map("active")
139      INACTIVE @map("inactive")
140      PENDING @map("pending")
141      REJECTED @map("rejected")
142      SUSPENDED @map("suspended")
143    }
144    
145    model KitchenDetails {
146      // Kitchen Details
147      id String @id @default(uuid())
148      createdAt DateTime @default(now())
149      updatedAt DateTime @updatedAt
150      deletedAt DateTime?
151    
```

<br/>

# Kitchens

<br/>

## Kitchen Details, Kitchen Equipment, Kitchen Amenities
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
145    model KitchenDetails {
146      // Kitchen Details
147      id String @id @default(uuid())
148      createdAt DateTime @default(now())
149      updatedAt DateTime @updatedAt
150      deletedAt DateTime?
151    
152      // Kitchen Details
153      name String @unique
154      description String
155      phone String
156      website String?
157      status KitchenStatus @default(PENDING) 
158    
159      // Time Slots
160      timeSlots TimeSlot[]
161      totalCreditsReceived Int @default(0) // Total Credits Received from Chefs for Bookings
162    
163      // Location Data
164      address String
165    
166      cityId String
167      city City @relation(fields: [cityId], references: [id])
168    
169      stateId String
170      state State @relation(fields: [stateId], references: [id])
171    
172      countryId String
173      country Country @relation(fields: [countryId], references: [id])
174    
175      zip String
176      lat String?
177      lon String?
178    
179      // Kitchen Certificates & identification
180      certificates Certificates[]
181    
182      // Chefs Allowed in Kitchen
183      chefsAllowed Int?
184    
185      // Kitchen Reviews
186      kitchenReviews KitchenReviews[]
187      
188      // Kitchen Owner 
189      ownerId String @unique
190      kitchenOwner KitchenUser @relation(fields: [ownerId], references: [id], onDelete: Cascade)
191    
192      equipmentList KitchenEquipment?
193      additionalEquipment String?
194    
195      kitchenMedia Media[]
196    }
197    
198    model KitchenEquipment {
199      id String @id @default(uuid())
200      createdAt DateTime @default(now())
201      updatedAt DateTime @updatedAt
202      deletedAt DateTime?
203    
204      amenities KitchenAmenities[]
205    
206      kitchenDetailsId String @unique
207      kitchenDetails KitchenDetails @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
208    }
209    
210    model KitchenAmenities{
211      id String @id @default(uuid())
212      name String
213      iconImage String?
214      status String?
215      required Boolean @default(false)
216    
217      kitchenEquipment KitchenEquipment[]
218    }
```

<br/>

# Chefs

<br/>

## Chef Company Details
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
229    model ChefCompanyDetails {
230      id String @id @default(uuid())
231      createdAt DateTime @default(now())
232      updatedAt DateTime @updatedAt
233      deletedAt DateTime?
234      name String
235      description String
236      phone String
237      website String?
238      status ChefStatus @default(PENDING)
239    
240      // Time Slots Selected
241      timeSlots TimeSlot[]
242    
243      // Location Data
244      address String
245    
246      cityId String
247      city City @relation(fields: [cityId], references: [id])
248    
249      stateId String
250      state State @relation(fields: [stateId], references: [id])
251    
252      countryId String
253      country Country @relation(fields: [countryId], references: [id])
254    
255      zip String
256      lat String?
257      lon String?
258    
259      // Chefs Allowed in Kitchen
260      kitchensAllowed Int?
261    
262      // Chef Reviews
263      chefReviews ChefReviews[]
264    
265      // Kitchen Reviews
266      kitchenReviews KitchenReviews[]
267    
268      // Chef Owner 
269      ownerId String 
270      chefOwner ChefUser @relation(fields: [ownerId], references: [id], onDelete: Cascade)
271    
272      chefMedia Media[]
273    
274      chefEquipment ChefEquipment?
275    }
```

<br/>

# Location Data

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
301    model City {
302      id String @id @default(uuid())
303      name String
304      status String
305    
306      stateId String
307      state State @relation(fields: [stateId], references: [id], onDelete: Cascade)
308    
309      kitchenDetails KitchenDetails[]
310      chefDetails ChefCompanyDetails[]
311    }
312    
313    model State {
314      id String @id @default(uuid())
315      name String
316      code String
317      status String
318    
319      city City[]
320    
321      countryId String
322      country Country @relation(fields: [countryId], references: [id], onDelete: Cascade)
323    
324      kitchenDetails KitchenDetails[]
325      chefDetails ChefCompanyDetails[]
326    }
327    
328    model Country {
329      id String @id @default(uuid())
330      name String
331      code String
332      status String
333    
334      state State[]
335    
336      kitchenDetails KitchenDetails[]
337      chefDetails ChefCompanyDetails[]
338    }
```

<br/>

# Reviews

<br/>

## Kitchen and Chefs Reviews
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
341    model KitchenReviews {
342      id String @id @default(uuid())
343      createdAt DateTime @default(now())
344      updatedAt DateTime @updatedAt
345      deletedAt DateTime?
346    
347      review String
348      rating Int
349    
350      kitchenDetailsId String
351      kitchenDetails KitchenDetails @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
352    
353      chefId String
354      chef ChefCompanyDetails @relation(fields: [chefId], references: [id], onDelete: Cascade)
355    }
356    
357    model ChefReviews {
358      id String @id @default(uuid())
359      createdAt DateTime @default(now())
360      updatedAt DateTime @updatedAt
361      deletedAt DateTime?
362    
363      review String
364      rating Int
365    
366      chefDetailsId String
367      chef ChefCompanyDetails @relation(fields: [chefDetailsId], references: [id], onDelete: Cascade)
368    
369      kitchenUserId String
370      kitchenUser KitchenUser @relation(fields: [kitchenUserId], references: [id], onDelete: Cascade)
371    }
```

<br/>

# Media

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
374    // Media Models: Certificates, Media, etc.
375    model Certificates {
376      id String @id @default(uuid())
377      createdAt DateTime @default(now())
378      updatedAt DateTime @updatedAt
379      deletedAt DateTime?
380      fileName String
381      fileSize BigInt 
382      fileUrl String
383      fileType String
384    
385      kitchenDetailsId String?
386      kitchenDetails KitchenDetails? @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
387    
388      chefDetailsId String?
389      chefDetails ChefUser? @relation(fields: [chefDetailsId], references: [id], onDelete: Cascade)
390    }
391    
392    model Media {
393      id String @id @default(uuid())
394      createdAt DateTime @default(now())
395      updatedAt DateTime @updatedAt
396      deletedAt DateTime?
397      fileName String
398      fileSize BigInt 
399      fileUrl String
400      fileType String
401    
402      kitchenDetailsId String?
403      kitchenDetails KitchenDetails? @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
404    
405      chefDetailsId String?
406      chefDetails ChefCompanyDetails? @relation(fields: [chefDetailsId], references: [id], onDelete: Cascade)
407    }
```

<br/>

# Booking Models

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
418    // Create model of a time slot
419    model TimeSlot {
420      id String @id @default(uuid())
421      createdAt DateTime @default(now())
422      updatedAt DateTime @updatedAt
423      deletedAt DateTime?
424    
425      // Cost Details
426      creditCost Int
427      creditPaid Int?
428      isPaid Boolean @default(false)
429      isRefunded Boolean @default(false)
430      refundReason String?
431      refundDate DateTime?
432      refundAmount Int?
433    
434      // Time Slot Details
435      timeSlotDate DateTime
436      startTime DateTime
437      endTime DateTime
438      timeSlotDuration Int
439      timeSlotType String?
440      timeSlotNotes String?
441      timeSlotStatus TimeSlotStatus @default(AVAILABLE)
442    
443      timeZone String?
444      canceledDate DateTime?
445      rejectedDate DateTime?
446      cancelationReasons String?
447      rejectionReason String?
448    
449      // Chef Selecting Time Slot
450      chefId String?
451      chef ChefCompanyDetails? @relation(fields: [chefId], references: [id])
452    
453      chefsAttending Int
454    
455    
456      // Time Slot Kitchen Details
457      kitchenDetailsId String
458      kitchenDetails KitchenDetails @relation(fields: [kitchenDetailsId], references: [id], onDelete: Cascade)
459    }
```

<br/>

# Credits Models

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
467    model CreditPackages {
468      id String @id @default(uuid())
469      createdAt DateTime @default(now())
470      updatedAt DateTime @updatedAt
471      deletedAt DateTime?
472    
473      name String
474      description String
475      creditsGranted Int
476      pricePerCredit Decimal
477      totalPrice Decimal
478      status CreditStatus @default(ACTIVE)
479    
480      creditBought BoughtCredits[]
481    }
482    
483    model BoughtCredits {
484      id String @id @default(uuid())
485      createdAt DateTime @default(now())
486      updatedAt DateTime @updatedAt
487      deletedAt DateTime?
488    
489      creditsBought Int
490      transactoinId String @default(uuid())
491    
492      // Credit Package Details
493      creditPackageId String
494      creditPackage CreditPackages @relation(fields: [creditPackageId], references: [id], onDelete: Cascade)
495    
496      // Chef Details
497      chefId String
498      chef ChefUser @relation(fields: [chefId], references: [id], onDelete: Cascade)
499    
500      // Payment Details
501      paymentId String
502      payment Payment @relation(fields: [paymentId], references: [id], onDelete: Cascade)
503    }
```

<br/>

# Payment Model

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 prisma/schema.prisma
```prisma
505    model Payment {
506      id String @id @default(uuid())
507      createdAt DateTime @default(now())
508      updatedAt DateTime @updatedAt
509      deletedAt DateTime?
510    
511      // Payment Details
512      paymentId String
513      paymentMethod String
514      paymentStatus String
515      paymentAmount Decimal
516      paymentCurrency String
517      paymentDate DateTime
518      paymentNotes String?
519    
520      // Payment Details
521      chefId String
522      chef ChefUser @relation(fields: [chefId], references: [id], onDelete: Cascade)
523    
524      creditsBought BoughtCredits[]
525    }
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](/repos/Z2l0aHViJTNBJTNBZm9vZHZhdWx0LWFwaSUzQSUzQWZvb2R2YXVsdC1pbw==/docs/t40ya).
