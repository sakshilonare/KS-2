import React from "react";
import NavigationBar from "./NavigationBar";
import { Link } from 'react-router-dom';
// import { Carousel } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Homepage = () => {
  return (
    <>
      <NavigationBar />

      <div
        className="relative min-h-screen min-w-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: "url('./home2.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          // filter: "grayscale(40%) opacity(0.8)"
        }}
      >
        {/* Dark overlay behind content */}
        {/* <div className="absolute inset-0 bg-black opacity-70 pointer-events-none z-0"></div> */}

        {/* Centered content */}
        <div className="text-center text-white flex justify-center items-center flex-col relative z-10">
          <h1 className="text-6xl font-bold mb-4 animate-bounce text-white-400">
            Welcome to Crop Auction Portal
          </h1>
          <a
            href="/login"
            className="bg-white text-green-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-300 transition duration-300"
          >
            Get Started
          </a>
        </div>
      </div>

      <section class="text-gray-600 body-font">
        <div class="container mx-auto flex px-2 py-24 md:flex-row flex-col items-center">
          <div class="lg:max-w-xl lg:w-full md:w-2/3 w-full mb-10 md:mb-0">
            <img
              class="object-cover object-center rounded h-96"
              alt="hero"
              src="tractor.jpg"
            />
          </div>
          <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 class="title-font sm:text-5xl text-4xl mb-4 font-medium text-gray-900">
              About Us
              <br class="hidden lg:inline-block" />
            </h1>
            <p class="mb-8 leading-relaxed">
              At KrishiSahyog, our Crop Auction Portal is transforming the
              agricultural landscape by directly connecting farmers and buyers,
              eliminating intermediaries, and streamlining the crop trading
              process. Our goal is to make agriculture more transparent,
              efficient, and accessible for everyone. Through advanced
              technology, we empower farmers to reach wider markets and secure
              fair, competitive prices for their produce, while buyers enjoy
              access to a diverse selection of fresh, high-quality crops.
              <br />
              <br />
              With innovation and integrity at the core of what we do, we are
              committed to creating a more connected and sustainable
              agricultural ecosystem. Every transaction on our platform ensures
              mutual benefits for both farmers and buyers, promoting fairness
              and trust in the process. Join us in reshaping the future of
              agriculture with KrishiSahyog.
            </p>
          </div>
        </div>
      </section>

      <section class="text-gray-600 body-font">
        <div class="container px-5 py-3 mx-auto">
          <div class="text-center mb-20">
            <h1 class="title-font sm:text-5xl text-4xl mb-4 font-medium text-gray-900">
              Our Services
              <br class="hidden lg:inline-block" />
            </h1>
            <p class="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-500s">
              Enhancing agricultural trade with a user-friendly platform for
              direct sales and competitive bidding.
            </p>
            <div class="flex mt-6 justify-center">
              <div class="w-16 h-1 rounded-full bg-lightgreen inline-flex"></div>
            </div>
          </div>
          <div class="flex flex-wrap -m-4">
            <div class="p-4 md:w-1/3">
              <div class="flex rounded-lg h-full bg-gray-100 p-8 flex-col transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-lightgreen text-white flex-shrink-0">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      class="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <h2 class="text-gray-900 text-lg title-font font-medium">
                    Marketplace
                  </h2>
                </div>
                <div class="flex-grow">
                  <p class="leading-relaxed text-base">
                    A dynamic platform where farmers can list and sell their crops directly to buyers.
                  </p>
                </div>
              </div>
            </div>
            <div class="p-4 md:w-1/3">
              <div class="flex rounded-lg h-full bg-gray-100 p-8 flex-col transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-lightgreen text-white flex-shrink-0">
                    <img src="auction.png" alt="Icon" class="w-5 h-5 object-cover rounded-full" />
                  </div>
                  <h2 class="text-gray-900 text-lg title-font font-medium">
                    Auction Platform
                  </h2>
                </div>
                <div class="flex-grow">
                  <p class="leading-relaxed text-base">
                    An interactive auction system that ensures competitive pricing for every crop.
                  </p>
                </div>
              </div>
            </div>


            <div class="p-4 md:w-1/3">
              <div class="flex rounded-lg h-full bg-gray-100 p-8 flex-col transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-lightgreen text-white flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>

                  </div>
                  <h2 class="text-gray-900 text-lg title-font font-medium">
                    Chatbot
                  </h2>
                </div>
                <div class="flex-grow">
                  <p class="leading-relaxed text-base">
                    A smart assistant providing instant support and guidance for all user queries and transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="text-gray-600 body-font">
        <div class="container px-5 py-24 mx-auto flex flex-wrap items-center">
          <div class="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <h1 class="title-font font-medium text-4xl text-gray-900">
              Get in Touch with Us
            </h1>
            <p class="leading-relaxed mt-4">
              <br />
              Reach out today and connect with our team for personalized support
              and solutions.
            </p>
          </div>
          <div class="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
            <div class="relative mb-4">
              <label for="full-name" class="leading-7 text-sm text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                id="full-name"
                name="full-name"
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div class="relative mb-4">
              <label for="email" class="leading-7 text-sm text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div class="relative mb-4">
              <label for="message" class="leading-7 text-sm text-gray-600">
                Message
              </label>
              <input
                id="message"
                name="message"
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                rows="4"
              />
            </div>

            <button class="text-white bg-lightgreen border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              Button
            </button>
            <p class="text-xs text-gray-500 mt-3">
              Literally you probably haven't heard of them jean shorts.
            </p>
          </div>
        </div>
      </section>

      <div id="bot" class="fixed bottom-4 right-4">
        <Link to="/chat">
        <button class="group relative" href="/chat">
          <img
            src="bot.png"
            alt="bot"
            class="w-20 h-20 object-cover rounded-full group-hover:hidden"
          />
          <img
            src="bot.gif"
            alt="bot-hover"
            class="w-20 h-20 object-cover rounded-full hidden group-hover:block"
          />
        </button>
        </Link>
      </div>
      <footer class="text-gray-600 body-font">
        <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <img src="footer_icon.png" alt="Icon" class="w-10 h-10 object-cover rounded-full" />
            <span class="ml-3 text-xl">Krishi-Sahyog</span>
          </a>
          <p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            © 2024 Krishi_Sahyog — All rights Reserved
          </p>
          <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <a class="text-gray-500">
              <svg
                fill="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>
            <a class="ml-3 text-gray-500">
              <svg
                fill="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
            <a class="ml-3 text-gray-500">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </a>
            <a class="ml-3 text-gray-500">
              <svg
                fill="currentColor"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="0"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="none"
                  d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                ></path>
                <circle cx="4" cy="4" r="2" stroke="none"></circle>
              </svg>
            </a>
          </span>
        </div>
      </footer>

    </>
  );
};

export default Homepage;
