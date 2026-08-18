import React, { useState } from 'react';

const FlightBookingDemo = () => {
  const [selectedTrip, setSelectedTrip] = useState('roundtrip');
  const [departDate, setDepartDate] = useState('Dec 15, 2023');
  const [returnDate, setReturnDate] = useState('Jan 15, 2024');
  const [travelers, setTravelers] = useState(1);
  const [selectedStops, setSelectedStops] = useState('any');

  return (
    <div className="shadow-[0_37.5px_75px_0_rgba(255,255,255,0.15)_inset,0_3.75px_7.5px_0_rgba(0,0,0,0.05),0_11.25px_22.5px_0_rgba(0,0,0,0.05),0_22.5px_45px_0_rgba(0,0,0,0.10)] backdrop-blur-[7.5px] mt-[-78px] w-full overflow-hidden bg-[rgba(5,5,5,0.90)] rounded-[15px] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)] max-md:max-w-full">
      {/* Header */}
      <header className="h-[70px] w-full max-md:max-w-full">
        <div className="flex w-full gap-[40px_100px] justify-between flex-wrap pl-[35px] pr-[34px] py-[23px] max-md:max-w-full max-md:px-5">
          <div className="flex items-center gap-[3px] text-sm text-white font-bold whitespace-nowrap tracking-[-0.68px] p-[3px]">
            <img
              src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/caa8d4afca92a4a5124434428149e3a7e731f322?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-[18px] self-stretch shrink-0 my-auto"
              alt="Skyscape Logo"
            />
            <div className="text-white self-stretch my-auto">
              Skyscape
            </div>
          </div>
          <nav className="flex min-w-60 gap-2 text-[11px] text-white font-medium whitespace-nowrap leading-none">
            {['Flights', 'Stays', 'Cars', 'Packages', 'Cruises'].map((item, index) => (
              <button
                key={item}
                className={`justify-center items-center shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] flex gap-2 overflow-hidden px-4 py-1.5 rounded-[74.25px] transition-colors ${
                  index === 0 
                    ? 'bg-[rgba(0,0,0,0.60)] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)]' 
                    : 'hover:bg-[rgba(0,0,0,0.40)]'
                }`}
              >
                <div className="text-white self-stretch my-auto">
                  {item}
                </div>
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="justify-center items-center shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] self-stretch flex gap-2 overflow-hidden text-[11px] text-white font-medium whitespace-nowrap leading-none my-auto px-4 py-1.5 rounded-[74.25px] hover:bg-white/10 transition-colors">
              <div className="text-white self-stretch my-auto">
                CA
              </div>
            </button>
            <div className="items-center self-stretch flex gap-[3px] bg-[rgba(0,0,0,0.60)] my-auto rounded-[37.5px] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)]">
              <div className="shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] self-stretch flex min-h-8 w-8 gap-2 h-8 my-auto rounded-3xl bg-white/10" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex w-full gap-[19px] justify-between flex-wrap pl-[23px] pr-[22px] py-[23px] max-md:max-w-full max-md:px-5">
        {/* Filters Sidebar */}
        <aside className="bg-blend-luminosity shadow-[0_5px_10px_0_rgba(0,0,0,0.10),0_15px_30px_0_rgba(0,0,0,0.10),0_20px_40px_0_rgba(0,0,0,0.15)] backdrop-blur-[10px] min-w-60 min-h-[647px] overflow-hidden w-[270px] bg-[rgba(0,0,0,0.60)] pt-[15px] pb-[34px] px-[15px] rounded-[7.5px] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)]">
          <div className="justify-center items-center flex min-h-[50px] w-full text-white font-medium whitespace-nowrap px-[7.5px] py-[15px]">
            <div className="text-white text-ellipsis text-[15px] self-stretch flex-1 shrink basis-[0%] my-auto">
              Filters
            </div>
            <button className="text-white text-xs self-stretch my-auto hover:text-blue-400 transition-colors">
              Reset
            </button>
          </div>
          
          <div className="border min-h-px w-full bg-[rgba(255,255,255,0.10)] border-[rgba(255,255,255,0.1)] border-solid" />
          
          {/* Sort by */}
          <div className="justify-center items-center flex w-full text-sm text-white font-medium p-[7.5px]">
            <div className="text-white text-ellipsis self-stretch flex-1 shrink basis-[0%] my-auto">
              Sort by
            </div>
            <img
              src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/d952ae0d4a2e12827da2a69e224ffb3e6557566e?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-[18px] self-stretch shrink-0 my-auto"
              alt="Sort"
            />
          </div>
          
          <div className="border min-h-px w-full bg-[rgba(255,255,255,0.10)] border-[rgba(255,255,255,0.1)] border-solid" />
          
          {/* Stops Filter */}
          <div className="w-full gap-[7.5px] p-[7.5px]">
            <div className="text-white text-ellipsis text-sm font-medium">
              Stops
            </div>
            <div className="w-full mt-2">
              {[
                { id: 'any', label: 'Any number of stops', checked: true },
                { id: 'nonstop', label: 'Nonstop only', checked: false },
                { id: 'one', label: '1 stop or fewer', checked: false },
                { id: 'two', label: '2 stops or fewer', checked: false }
              ].map((option) => (
                <label key={option.id} className="items-center flex w-full gap-[7.5px] pl-[7.5px] pr-0 py-[7.5px] cursor-pointer hover:bg-white/5 rounded transition-colors">
                  <input
                    type="radio"
                    name="stops"
                    value={option.id}
                    checked={selectedStops === option.id}
                    onChange={(e) => setSelectedStops(e.target.value)}
                    className="sr-only"
                  />
                  <div className="self-stretch flex min-h-[18px] items-center justify-center w-[18px] my-auto">
                    {option.checked ? (
                      <img
                        src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/64cac8b292578e19c7bcc139e189df88170599ae?placeholderIfAbsent=true"
                        className="aspect-[1] object-contain w-3 self-stretch my-auto"
                        alt="Selected"
                      />
                    ) : (
                      <div className="self-stretch flex min-h-3 w-3 stroke-[rgba(255,255,255,0.70)] my-auto rounded-[50%] border-[0.75px] border-solid border-[rgba(255,255,255,0.7)]" />
                    )}
                  </div>
                  <div className="text-white text-xs font-normal self-stretch flex-1 shrink basis-[0%] my-auto">
                    {option.label}
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          {/* Price Range */}
          <div className="justify-center items-stretch flex w-full flex-col gap-[7.5px] p-[7.5px]">
            <div className="text-white text-ellipsis text-sm font-medium">
              Price
            </div>
            <div className="justify-center items-stretch relative flex w-full flex-col mt-2 px-0 py-[7.5px]">
              <div className="z-0 flex w-full gap-[40px_100px] text-[11px] text-white font-medium leading-none justify-between">
                <div className="text-white">
                  Up to CA$6000
                </div>
                <button className="text-white hover:text-blue-400 transition-colors">
                  Clear
                </button>
              </div>
              <div className="items-center z-0 flex h-[9px] w-full gap-[-10px] bg-[rgba(255,255,255,0.20)] mt-2 px-0.5 rounded-[15px] border-[0.375px] border-solid border-[rgba(255,255,255,0.10)]">
                <div className="self-stretch flex w-[129px] shrink-0 h-[5px] my-auto rounded-sm bg-blue-500" />
                <div className="shadow-[2px_2px_4px_rgba(0,0,0,0.2)] self-stretch flex w-3.5 shrink-0 h-[13px] my-auto rounded-[15px] bg-white cursor-pointer" />
              </div>
            </div>
          </div>
        </aside>

        {/* Search Flight Form */}
        <div className="min-w-60 w-[351px]">
          <form className="shadow-[0_3.75px_7.5px_0_rgba(0,0,0,0.10),0_11.25px_22.5px_0_rgba(0,0,0,0.10),0_15px_30px_0_rgba(0,0,0,0.15)] backdrop-blur-[7.5px] min-h-[293px] w-full max-w-[341px] bg-[rgba(0,0,0,0.60)] pt-[15px] pb-[34px] px-[15px] rounded-[7.5px] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)]">
            {/* Trip Type Selection */}
            <div className="flex w-full gap-3.5">
              {[
                { id: 'roundtrip', label: 'Roundtrip', checked: true },
                { id: 'oneway', label: 'One way', checked: false },
                { id: 'multicity', label: 'Multi-City', checked: false }
              ].map((option) => (
                <label key={option.id} className="flex items-center gap-[5px] text-xs text-white font-medium whitespace-nowrap cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    value={option.id}
                    checked={selectedTrip === option.id}
                    onChange={(e) => setSelectedTrip(e.target.value)}
                    className="sr-only"
                  />
                  {option.checked ? (
                    <img
                      src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/e67324b643156f61a9960a8c6074bd75503ecad7?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-3 self-stretch shrink-0 my-auto"
                      alt="Selected"
                    />
                  ) : (
                    <div className="self-stretch w-3 my-auto">
                      <div className="flex w-3 shrink-0 h-3 bg-[rgba(0,0,0,0.60)] rounded-[50%] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)]" />
                    </div>
                  )}
                  <div className="text-white self-stretch my-auto">
                    {option.label}
                  </div>
                </label>
              ))}
            </div>

            {/* Location Fields */}
            <div className="flex w-full flex-col items-stretch justify-center mt-[15px]">
              <div className="relative flex w-full gap-3">
                <div className="items-stretch bg-blend-luminosity z-0 flex gap-2 flex-1 shrink basis-[0%] bg-[rgba(0,0,0,0.60)] p-2 rounded-[7.5px] border-[0.563px] border-solid border-[rgba(255,255,255,0.10)]">
                  <div className="flex items-center gap-2 justify-center h-full w-9 p-2">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/670346717c607a90220db48f07b479a9a72e8eef?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-[18px] self-stretch my-auto"
                      alt="Location"
                    />
                  </div>
                  <div className="flex flex-col text-center">
                    <div className="text-white text-[9px] font-medium">
                      From
                    </div>
                    <input
                      type="text"
                      defaultValue="Montreal, Canada"
                      className="text-white text-xs font-normal bg-transparent border-none outline-none"
                      readOnly
                    />
                  </div>
                </div>
                <div className="items-stretch bg-blend-luminosity z-0 flex gap-[3px] flex-1 shrink basis-[0%] bg-[rgba(0,0,0,0.60)] p-2 rounded-[7.5px] border-[0.563px] border-solid border-[rgba(255,255,255,0.10)]">
                  <div className="flex items-center gap-2 justify-center h-full w-[33px] pl-2 pr-[7px] py-2">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/670346717c607a90220db48f07b479a9a72e8eef?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-[18px] self-stretch my-auto"
                      alt="Location"
                    />
                  </div>
                  <div className="flex flex-col text-center">
                    <div className="text-white text-[9px] font-medium">
                      To
                    </div>
                    <input
                      type="text"
                      defaultValue="Tokyo, Japan"
                      className="text-white text-xs font-normal bg-transparent border-none outline-none"
                      readOnly
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="justify-center items-center shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] absolute z-0 flex min-h-9 gap-2 overflow-hidden w-9 h-9 -translate-x-2/4 translate-y-[0%] bg-[rgba(0,0,0,0.60)] px-[5px] rounded-3xl border-[0.75px] border-solid border-[rgba(255,255,255,0.10)] left-2/4 bottom-1 hover:bg-white/10 transition-colors"
                >
                  <img
                    src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/f7d3d9839cbd6bc4e45440de25ad1ab2dc02fc89?placeholderIfAbsent=true"
                    className="aspect-[1] object-contain w-3 self-stretch h-3 my-auto"
                    alt="Swap"
                  />
                </button>
              </div>

              {/* Date and Details Fields */}
              <div className="content-start flex-wrap flex w-full gap-3 mt-[15px]">
                <div className="min-w-[140px] items-stretch bg-blend-luminosity flex gap-[3px] flex-1 shrink basis-[0%] bg-[rgba(0,0,0,0.60)] p-1.5 rounded-[7.5px] border-[0.563px] border-solid border-[rgba(255,255,255,0.10)]">
                  <div className="flex items-center gap-2 justify-center h-full w-9 p-2">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/1fbaad9be9de849f90b7150da4b424d1941fd63a?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-[18px] self-stretch my-auto"
                      alt="Calendar"
                    />
                  </div>
                  <div className="flex flex-col text-center">
                    <div className="text-white text-[9px] font-medium">
                      Depart
                    </div>
                    <input
                      type="text"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      className="text-white text-xs font-normal bg-transparent border-none outline-none"
                    />
                  </div>
                </div>
                <div className="min-w-[140px] items-stretch bg-blend-luminosity flex gap-[3px] flex-1 shrink basis-[0%] bg-[rgba(0,0,0,0.60)] p-1.5 rounded-[7.5px] border-[0.563px] border-solid border-[rgba(255,255,255,0.10)]">
                  <div className="flex items-center gap-2 justify-center h-full w-9 p-2">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/1fbaad9be9de849f90b7150da4b424d1941fd63a?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-[18px] self-stretch my-auto"
                      alt="Calendar"
                    />
                  </div>
                  <div className="flex flex-col text-center">
                    <div className="text-white text-[9px] font-medium">
                      Return
                    </div>
                    <input
                      type="text"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="text-white text-xs font-normal bg-transparent border-none outline-none"
                    />
                  </div>
                </div>
                <div className="min-w-[140px] items-stretch bg-blend-luminosity flex gap-[3px] flex-1 shrink basis-[0%] bg-[rgba(0,0,0,0.60)] p-1.5 rounded-[7.5px] border-[0.563px] border-solid border-[rgba(255,255,255,0.10)]">
                  <div className="flex items-center gap-2 justify-center h-full w-9 p-2">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/9adb89d0f2eca74bb365644660966394de15c516?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-[18px] self-stretch my-auto"
                      alt="Class"
                    />
                  </div>
                  <div className="flex flex-col whitespace-nowrap text-center">
                    <div className="text-white text-[9px] font-medium">
                      Class
                    </div>
                    <select className="text-white text-xs font-normal bg-transparent border-none outline-none">
                      <option value="economy">Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First</option>
                    </select>
                  </div>
                </div>
                <div className="min-w-[140px] items-stretch bg-blend-luminosity flex gap-[3px] flex-1 shrink basis-[0%] bg-[rgba(0,0,0,0.60)] p-1.5 rounded-[7.5px] border-[0.563px] border-solid border-[rgba(255,255,255,0.10)]">
                  <div className="flex items-center gap-2 justify-center h-full w-9 p-2">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/9adb89d0f2eca74bb365644660966394de15c516?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-[18px] self-stretch my-auto"
                      alt="Travelers"
                    />
                  </div>
                  <div className="flex flex-col text-center my-auto">
                    <div className="text-white text-[9px] font-medium">
                      Travellers
                    </div>
                    <div className="text-white text-xs font-normal">
                      {travelers} Traveller{travelers !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="justify-center items-center shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] self-center flex gap-2 text-[10px] text-white font-medium leading-loose bg-[#3395FF] mt-[15px] px-4 py-1.5 rounded-lg hover:bg-[#2980FF] transition-colors"
              >
                <div className="text-white self-stretch my-auto">
                  Search Flights
                </div>
              </button>
            </div>
          </form>

          {/* Flight Results */}
          <div className="shadow-[0_3.75px_7.5px_0_rgba(0,0,0,0.10),0_11.25px_22.5px_0_rgba(0,0,0,0.10),0_15px_30px_0_rgba(0,0,0,0.15)] backdrop-blur-[7.5px] min-h-[340px] w-full max-w-[351px] gap-2.5 bg-[rgba(0,0,0,0.60)] mt-[15px] p-5 rounded-[10px] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)]">
            <div className="text-white text-sm font-medium">
              Departure Flights
            </div>
            
            {/* Flight Cards */}
            {[1, 2].map((flight) => (
              <div key={flight} className="flex min-h-[137px] w-full items-stretch gap-2 mt-2.5">
                <div className="min-w-60 w-full flex-1 shrink basis-[0%]">
                  <div className="shadow-[0_1px_0_0_rgba(0,0,0,0.03),0_2px_2px_0_rgba(0,0,0,0.03),0_5px_5px_0_rgba(0,0,0,0.05)] backdrop-blur-[10px] w-full flex-1 bg-[rgba(0,0,0,0.60)] p-[15px] rounded-[10px] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)] hover:bg-[rgba(0,0,0,0.70)] transition-colors cursor-pointer">
                    <div className="flex w-full gap-[40px_63px] justify-between flex-1 h-full">
                      <div>
                        <div className="text-white text-xs font-medium">
                          7:05 AM
                        </div>
                        <div className="text-white text-[11px] font-normal leading-none">
                          Montreal YUL
                        </div>
                      </div>
                      <div className="flex flex-col items-center text-[10px] text-white font-normal whitespace-nowrap leading-loose justify-center">
                        <img
                          src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/dec9534e569006ea3b217c84e36449a847463659?placeholderIfAbsent=true"
                          className="aspect-[1] object-contain w-[18px]"
                          alt="Flight path"
                        />
                        <div className="text-white">
                          13:55
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-white text-xs font-medium">
                          8:05 PM
                        </div>
                        <div className="text-white text-[11px] font-normal leading-none">
                          Tokyo NRT
                        </div>
                      </div>
                    </div>
                    <div className="border min-h-px w-full bg-[rgba(255,255,255,0.10)] mt-[15px] border-[rgba(255,255,255,0.1)] border-dashed" />
                    <div className="flex w-full gap-[40px_100px] justify-between flex-1 h-full mt-[15px]">
                      <div className="flex min-h-[18px] items-center gap-2">
                        <img
                          src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/be4502e3191abe70d33727862335e5dd832e3cae?placeholderIfAbsent=true"
                          className="aspect-[1] object-contain w-[18px] self-stretch shrink-0 my-auto"
                          alt="Airline"
                        />
                        <img
                          src="https://api.builder.io/api/v1/image/assets/a296e6f6909345febc364568fca847ed/225dbf24094359e1636d671ad72388a58b6f3419?placeholderIfAbsent=true"
                          className="aspect-[11.36] object-contain w-[68px] fill-white self-stretch shrink-0 my-auto"
                          alt="Airline logo"
                        />
                      </div>
                      <div className="text-white text-xs font-medium">
                        $ 1,400
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date Picker and Statistics */}
        <div className="min-w-60 w-[286px]">
          {/* Date Picker */}
          <div className="min-w-[210px] shadow-[0_5px_10px_0_rgba(0,0,0,0.10),0_15px_30px_0_rgba(0,0,0,0.10),0_20px_40px_0_rgba(0,0,0,0.15)] backdrop-blur-[10px] w-full max-w-[286px] font-medium bg-[rgba(0,0,0,0.60)] p-3 rounded-[10px] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)]">
            <div className="flex w-full items-center gap-[40px_61px] text-xs text-white justify-between">
              <button className="shadow-[0_0.75px_0_0_rgba(0,0,0,0.05),0_3px_3px_0_rgba(0,0,0,0.05),0_7.5px_7.5px_0_rgba(0,0,0,0.10)] backdrop-blur-[7.5px] self-stretch flex w-[21px] shrink-0 h-[21px] gap-2 bg-[rgba(0,0,0,0.60)] my-auto rounded-3xl border-[0.75px] border-solid border-[rgba(255,255,255,0.10)] hover:bg-white/10 transition-colors" />
              <div className="self-stretch flex items-center gap-1.5 overflow-hidden my-auto">
                <div className="text-white self-stretch my-auto">
                  November 2023
                </div>
              </div>
              <button className="shadow-[0_0.75px_0_0_rgba(0,0,0,0.05),0_3px_3px_0_rgba(0,0,0,0.05),0_7.5px_7.5px_0_rgba(0,0,0,0.10)] backdrop-blur-[7.5px] self-stretch flex w-[21px] shrink-0 h-[21px] gap-2 bg-[rgba(0,0,0,0.60)] my-auto rounded-3xl border-[0.75px] border-solid border-[rgba(255,255,255,0.10)] hover:bg-white/10 transition-colors" />
            </div>
            <div className="flex w-full text-[10px] text-white whitespace-nowrap text-center leading-loose justify-between mt-2">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <div key={day} className="flex-1 shrink basis-[0%]">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Grid */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex min-h-[30px] w-full mt-2" />
            ))}
          </div>

          {/* Flight Statistics */}
          <div className="w-full max-w-[285px] mt-[15px]">
            <div className="text-white text-sm font-medium">
              Flight Price Statistics
            </div>
            <div className="shadow-[0_0.75px_0_0_rgba(0,0,0,0.05),0_3px_3px_0_rgba(0,0,0,0.05),0_7.5px_7.5px_0_rgba(0,0,0,0.10)] backdrop-blur-[7.5px] flex w-full flex-col items-stretch bg-[rgba(0,0,0,0.60)] mt-[11px] p-[15px] rounded-[15px] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)]">
              <div className="justify-center items-center shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] self-center flex gap-2 text-[9px] text-white font-medium whitespace-nowrap text-center bg-[rgba(0,0,0,0.60)] px-4 py-1.5 rounded-[22.5px] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)]">
                <button className="self-stretch flex items-center gap-2 justify-center my-auto px-[9px] py-[3px] hover:text-blue-400 transition-colors">
                  <div className="self-stretch my-auto">
                    Day
                  </div>
                </button>
                <div className="border self-stretch w-0 shrink-0 h-[15px] bg-[rgba(255,255,255,0.10)] my-auto border-[rgba(255,255,255,0.1)] border-solid" />
                <button className="self-stretch flex items-center gap-2 text-[#3395FF] justify-center my-auto px-[9px] py-[3px]">
                  <div className="text-[#3395FF] self-stretch my-auto">
                    Week
                  </div>
                </button>
                <div className="border self-stretch w-0 shrink-0 h-[15px] bg-[rgba(255,255,255,0.10)] my-auto border-[rgba(255,255,255,0.1)] border-solid" />
                <button className="self-stretch flex items-center gap-2 justify-center my-auto px-[9px] py-[3px] hover:text-blue-400 transition-colors">
                  <div className="self-stretch my-auto">
                    Month
                  </div>
                </button>
              </div>
              
              {/* Chart */}
              <div className="mt-1.5">
                {/* Grid Lines */}
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`border min-h-0 w-full ${i > 0 ? 'mt-[27px]' : ''} border-[rgba(12,8,26,0.04)] border-dashed`} />
                ))}
              </div>
              
              {/* Y-axis Labels */}
              <div className="z-10 mt-[-123px] text-[9px] text-white font-medium whitespace-nowrap">
                <div className="text-white">100%</div>
                <div className="text-white mt-[41px] max-md:mt-10">60%</div>
                <div className="text-white mt-[41px] max-md:mt-10">20%</div>
              </div>
              
              {/* Chart Bars */}
              <div className="flex mt-[-110px] w-[225px] max-w-full gap-[27px] text-[9px] text-white font-medium justify-between">
                {[
                  { height: 108, label: '1-7 nov' },
                  { height: 82, label: '8-14 nov' },
                  { height: 54, label: '15-21 nov' },
                  { height: 109, label: '22-28 nov' }
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center w-9">
                    <div
                      className="bg-[rgba(51,149,255,1)] flex w-9 fill-[#3395FF] rounded-[0px_0px_0px_0px] hover:bg-[rgba(51,149,255,0.8)] transition-colors cursor-pointer"
                      style={{ minHeight: `${bar.height}px` }}
                    />
                    <div className="mt-[9px]">{bar.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Notification */}
            <div className="min-w-[255px] items-center bg-blend-overlay flex min-h-[75px] w-full gap-[18px] mt-[11px] p-3 rounded-[15px] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)] hover:bg-white/5 transition-colors cursor-pointer">
              <div className="shadow-[0_0.75px_0_0_rgba(0,0,0,0.05),0_3px_3px_0_rgba(0,0,0,0.05),0_7.5px_7.5px_0_rgba(0,0,0,0.10)] backdrop-blur-[7.5px] self-stretch flex w-[34px] shrink-0 h-[34px] bg-[#3395FF] my-auto rounded-[74.25px] border-[0.75px] border-solid border-[rgba(255,255,255,0.10)]" />
              <div className="self-stretch flex-1 shrink basis-[0%] my-auto">
                <div className="flex w-full gap-[40px_100px] justify-between">
                  <div className="flex items-center gap-2 text-xs text-white font-medium">
                    <div className="text-white self-stretch my-auto">
                      What's New
                    </div>
                  </div>
                  <div className="text-white text-[11px] font-normal leading-none">
                    24m
                  </div>
                </div>
                <div className="text-white text-[11px] font-normal leading-[15px]">
                  The prices are about to rise due to the holiday season.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FlightBookingDemo;
