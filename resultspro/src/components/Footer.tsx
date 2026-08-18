import React from 'react';

const Footer = () => {
  return (
    <footer className="justify-center items-stretch z-0 flex w-full flex-col bg-black max-md:max-w-full">
      <div className="justify-between backdrop-blur-[30px] flex w-full gap-[40px_100px] flex-wrap p-24 rounded-[30px_30px_0_0] max-md:max-w-full max-md:px-5">
        <div className="flex items-center gap-3 text-lg text-white font-bold whitespace-nowrap tracking-[-0.9px] p-1">
          <img
            src="/logo.png"
            className="h-12 w-auto object-contain"
            alt="Results Pro Logo"
          />
          <div className="text-white">
            Results Pro
          </div>
        </div>
        <div className="flex min-w-60 max-w-[720px] gap-[40px_88px] justify-between flex-wrap flex-1 shrink basis-[0%] max-md:max-w-full">
          {/* Products Column */}
          <div className="flex flex-col items-stretch text-[13px] text-white font-normal whitespace-nowrap leading-loose">
            <div className="flex flex-col items-center text-sm text-white font-medium leading-none justify-center pl-2.5 pr-5 py-2.5 rounded-[10px]">
              <div className="flex gap-2.5 overflow-hidden">
                <div className="w-0 shrink-0 h-5 border-[rgba(255,255,255,0.1)] border-solid border-2" />
                <div className="text-white">Products</div>
              </div>
            </div>
            {['Courses', 'Tutorials', 'Pricing'].map((item) => (
              <button
                key={item}
                className="flex flex-col items-center justify-center px-5 py-2.5 rounded-[10px] hover:bg-white/10 transition-colors"
              >
                <div>{item}</div>
              </button>
            ))}
          </div>

          {/* Company Column */}
          <div className="flex flex-col text-[13px] text-white font-normal leading-loose">
            <div className="flex flex-col items-center text-sm text-white font-medium whitespace-nowrap leading-none justify-center p-2.5 rounded-[10px]">
              <div className="flex gap-2.5 overflow-hidden">
                <div className="w-0 shrink-0 h-5 border-[rgba(255,255,255,0.1)] border-solid border-2" />
                <div className="text-white">Company</div>
              </div>
            </div>
            {['About Us', 'Contact Us'].map((item) => (
              <button
                key={item}
                className="flex flex-col items-center justify-center px-5 py-2.5 rounded-[10px] hover:bg-white/10 transition-colors"
              >
                <div>{item}</div>
              </button>
            ))}
          </div>

          {/* Resources Column */}
          <div className="flex flex-col items-stretch text-[13px] text-white font-normal whitespace-nowrap leading-loose">
            <div className="flex flex-col items-center text-sm text-white font-medium leading-none justify-center p-2.5 rounded-[10px]">
              <div className="flex gap-2.5 overflow-hidden">
                <div className="w-0 shrink-0 h-5 border-[rgba(255,255,255,0.1)] border-solid border-2" />
                <div className="text-white">Resources</div>
              </div>
            </div>
            {['Downloads', 'Community'].map((item) => (
              <button
                key={item}
                className="flex flex-col items-center justify-center px-5 py-2.5 rounded-[10px] hover:bg-white/10 transition-colors"
              >
                <div>{item}</div>
              </button>
            ))}
          </div>

          {/* Follow Us Column */}
          <div className="flex flex-col items-stretch">
            <div className="flex flex-col items-center text-sm text-white font-medium leading-none justify-center pr-5 py-2.5 rounded-[10px]">
              <div className="flex gap-2.5 overflow-hidden">
                <div className="w-0 shrink-0 h-5 border-[rgba(255,255,255,0.1)] border-solid border-2" />
                <div className="text-white">FOLLOW US</div>
              </div>
            </div>
            <div className="opacity-60 flex gap-2.5 mt-4">
              {[
                'https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/a2f4c8ef1ce6f5a272d4bc36c8c0b90213a51216?placeholderIfAbsent=true',
                'https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/0a98801f0be729af2872477828935430b187ac4b?placeholderIfAbsent=true',
                'https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/07d0ff9372a3540782b8644f14ec67fb73f1fcc4?placeholderIfAbsent=true'
              ].map((src, index) => (
                <button
                  key={index}
                  className="justify-center items-center border shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] flex min-h-9 gap-2.5 overflow-hidden w-9 h-9 bg-[rgba(0,0,0,0.60)] px-1.5 rounded-[32px] border-solid border-[rgba(255,255,255,0.10)] hover:bg-white/10 transition-colors"
                >
                  <img
                    src={src}
                    className="aspect-[1] object-contain w-4 self-stretch h-4 my-auto"
                    alt={`Social ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="justify-between items-center flex w-full gap-[40px_100px] flex-wrap px-24 py-5 border-t-[rgba(255,255,255,0.10)] border-t border-solid max-md:max-w-full max-md:px-5">
        <div className="text-white text-[13px] font-normal leading-loose self-stretch my-auto">
          © 2024 Company
        </div>
        <div className="self-stretch flex min-w-60 items-center gap-10 my-auto">
          <nav className="self-stretch flex min-w-60 items-center gap-4 text-[13px] text-white font-normal leading-loose justify-center my-auto">
            {['Terms of Service', 'Privacy Policy', 'English'].map((item, index) => (
              <React.Fragment key={item}>
                <button className="self-stretch my-auto hover:text-blue-400 transition-colors">
                  {item}
                </button>
                {index < 2 && (
                  <div className="border self-stretch w-0 shrink-0 h-[17px] my-auto border-[rgba(255,255,255,0.1)] border-solid" />
                )}
              </React.Fragment>
            ))}
            <img
              src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/818af71ce3c330555157f14969835affcee815e5?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
              alt="Language"
            />
          </nav>
          <button className="justify-center items-center border self-stretch flex min-h-11 gap-2.5 w-11 h-11 bg-[rgba(0,0,0,0.60)] my-auto px-1.5 rounded-[32px] border-solid border-[rgba(255,255,255,0.10)] hover:bg-white/10 transition-colors">
            <img
              src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/7156eb903f7db96c267f90a625fa7d56f374ce9d?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6 self-stretch my-auto"
              alt="Go back"
            />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
