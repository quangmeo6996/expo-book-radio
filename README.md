# Getting Started

> **Note**: Make sure you have completed the [React Native expo](https://docs.expo.dev/more/create-expo/) instructions till "Creating a new application" step, before proceeding.

## Step 1: Installation

1. Clone the repository:
```bash
 git clone https://github.com/yourusername/yourproject.git
```

2. Install dependencies:
```bash
 yarn install
 ```

## Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 3: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 4: Environment Setup

```bash
node: v18.19.0
pod: 1.15.2
npm: 10.2.3
yarn: 1.22.19
```

## Step 5: Instructions for creating sample data

We will have 2 data forms for reading books and audio books.

```bash
# Reading books
{
  "name": "The Great Gatsby", // name of book
  "author": "F. Scott Fitzgerald", // author
  "description": "The Great Gatsby is a 1925 novel by American writer F.", // description
  "thumbnail": "https://images-na.ssl-images-amazon.com/images/I/51ZUv0JF5EL._SX331_BO1,204,203,200_.jpg", // thumbnail book
  "rating": "4.5", // rating
  "price": 200000, // price in VND
  "typeBook": "READ", // READ or RADIO
  "numberChapter": 100, // number of chapters
  "numberPage":  200, // number of pages
  "category": 0 // 0: Cultural books, 1: Psychology and love books
}

# Audio books
{
  "name": "The Great Gatsby", // name of book
  "author": "F. Scott Fitzgerald", // author
  "description": "The Great Gatsby is a 1925 novel by American writer F.", // description
  "thumbnail": "https://images-na.ssl-images-amazon.com/images/I/51ZUv0JF5EL._SX331_BO1,204,203,200_.jpg", // thumbnail book
  "rating": "4.5", // rating
  "price": 200000, // price in VND
  "typeBook": "RADIO", // READ or RADIO
  "numberChapter": 100, // number of chapters
  "numberPage":  200, // number of pages
  "category": 1 // 0: Cultural books, 1: Psychology and love books,
  "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // url audio book
}
```

## Step 6: Build Apk File
```bash
cd /android
./gradlew assembleRelease
```
After building app, you can get it from directory android/app/build/outputs/apk/release
# expo-book-radio
