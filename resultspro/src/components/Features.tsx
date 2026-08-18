import React from 'react';
import GlowButton from './ui/GlowButton';
import FlightBookingDemo from './FlightBookingDemo';

const Features = () => {
  return (
    <section className="z-0 flex w-full flex-col overflow-hidden items-stretch justify-center bg-black px-[70px] py-[130px] max-md:max-w-full max-md:pl-5 max-md:py-[100px] relative">
      <img
        src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/f2c64ab72582cbb7f8e3c676d65b9ab312a0d662?placeholderIfAbsent=true"
        className="absolute h-full w-full object-cover inset-0"
        alt="Background"
      />
      <div className="mb-[-26px] max-md:max-w-full max-md:mb-2.5 relative z-10">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          <div className="w-[46%] max-md:w-full max-md:ml-0">
            <div className="grow max-md:max-w-full max-md:mt-10">
              <h2 className="text-white text-6xl font-semibold tracking-[-3px] max-md:max-w-full max-md:text-[40px]">
                <span className="font-medium">Craft </span>
                <span className="font-medium text-white">
                  captivating websites with a canvas you already know
                </span>
              </h2>
              <div className="flex w-full max-w-[580px] flex-col items-stretch mt-[60px] max-md:max-w-full max-md:mt-10">
                {[
                  {
                    title: 'Components',
                    description: 'A collection of versatile components that can be tailored to fit the specific needs of your project, ensuring both aesthetic appeal and functionality.'
                  },
                  {
                    title: 'Glass, Outline, Flat styles',
                    description: 'Choose from these diverse design styles to cater to different aesthetic preferences and project requirements.'
                  },
                  {
                    title: 'Templates and Sections',
                    description: 'Streamline your design process with ready-to-use templates and sections, adaptable to various web projects.'
                  }
                ].map((feature, index) => (
                  <div key={index} className={`w-full ${index > 0 ? 'mt-10' : ''} max-md:max-w-full`}>
                    <div className="text-white text-lg font-medium max-md:max-w-full">
                      {feature.title}
                    </div>
                    <div className="text-white text-base font-normal leading-6 mt-2 max-md:max-w-full">
                      {feature.description}
                    </div>
                  </div>
                ))}
                <GlowButton className="mt-10">
                  <div className="text-white self-stretch my-auto">
                    START FREE TRIAL
                  </div>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/35733c589e457b61e6d23fc048b3c203be565698?placeholderIfAbsent=true"
                    className="aspect-[1] object-contain w-4 self-stretch shrink-0 h-4 my-auto"
                    alt="Arrow"
                  />
                </GlowButton>
              </div>
            </div>
          </div>
          <div className="w-[54%] ml-5 max-md:w-full max-md:ml-0">
            <div className="grow pt-[77px] max-md:max-w-full max-md:mt-10">
              <div className="z-10 flex shrink-0 h-px bg-[rgba(255,255,255,0.10)] mt-[77px] rounded-[7.5px] max-md:max-w-full max-md:mt-10" />
              <FlightBookingDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
