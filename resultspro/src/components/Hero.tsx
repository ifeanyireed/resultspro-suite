import React from 'react';

const Hero = () => {
  return (
    <section className="bg-black z-0 w-full overflow-hidden max-md:max-w-full">
      <div className="flex flex-col relative min-h-[900px] w-full items-center pt-[47px] pb-[209px] px-20 max-md:max-w-full max-md:pb-[100px] max-md:px-5">
        <img
          src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/f2c64ab72582cbb7f8e3c676d65b9ab312a0d662?placeholderIfAbsent=true"
          className="absolute h-full w-full object-cover inset-0"
          alt="Background"
        />
        <img
          src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/efb3f761b9eeeaeca815e62304e40f3fe9b54ac2?placeholderIfAbsent=true"
          className="aspect-[1.1] object-contain w-[705px] mb-[-42px] max-w-full max-md:mb-2.5 relative z-10"
          alt="Hero Image"
        />
      </div>
    </section>
  );
};

export default Hero;
