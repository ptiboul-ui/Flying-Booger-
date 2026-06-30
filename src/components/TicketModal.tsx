import React, { useState } from 'react';
import { X, Check, Flame, Ticket, Printer, Share2 } from 'lucide-react';
import { Gig } from '../types';

interface TicketModalProps {
  gig: Gig | null;
  onClose: () => void;
}

export default function TicketModal({ gig, onClose }: TicketModalProps) {
  const [userName, setUserName] = useState('');
  const [ticketTier, setTicketTier] = useState<'GA' | 'VIP'>('GA');
  const [ticketConfirmed, setTicketConfirmed] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  if (!gig) return null;

  const handleBookTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    // Generate random Ticket Number
    const randNum = 'SNOT-' + Math.floor(100000 + Math.random() * 900000);
    setTicketNumber(randNum);
    setTicketConfirmed(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Concert Ticket: ${userName}'s ${ticketTier === 'VIP' ? 'VIP SNOT PASS' : 'GENERAL ADMISSION'} Ticket for FLYING BOOGER @ ${gig.location} // ${gig.venue}. Ticket ID: ${ticketNumber}`);
    alert('TICKET ACCESS CODE COPIED TO CLIPBOARD! STAY LOUD!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      {/* Main Container */}
      <div className="bg-surface border-4 border-primary shadow-[12px_12px_0px_0px_#c3f400] relative max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 p-6 md:p-8 rounded">
        {/* Grain background */}
        <div className="absolute inset-0 grain-texture pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-[#c3f400] pb-4 mb-6 relative">
          <div>
            <span className="font-mono text-xs text-[#c3f400] tracking-widest uppercase block mb-1">
              {ticketConfirmed ? 'TICKET SECURED' : 'CHAOS REGISTRATION'}
            </span>
            <h2 className="font-headline-xl text-3xl md:text-4xl uppercase text-white font-black italic tracking-tighter leading-none">
              {ticketConfirmed ? 'YOUR SNOT PASS' : 'BUY TOUR ACCESS'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-outline hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!ticketConfirmed ? (
          /* Form Stage */
          <form onSubmit={handleBookTicket} className="space-y-6 relative">
            <div className="bg-surface-container border-2 border-dashed border-outline-variant p-4">
              <span className="font-mono text-[10px] text-on-surface-variant block uppercase mb-2">SELECTED SHOW:</span>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="font-mono text-xs text-[#c3f400] font-black">{gig.date}</span>
                  <h3 className="font-headline-md text-2xl uppercase text-white font-bold leading-none mt-1">
                    {gig.location} // {gig.venue}
                  </h3>
                </div>
                <div className="text-right sm:text-right">
                  <span className="font-mono text-xs text-on-surface-variant uppercase block">BASE PRICE</span>
                  <span className="font-headline-md text-2xl text-white font-black">${gig.price}</span>
                </div>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4">
              <div>
                <label className="font-mono text-xs text-on-surface-variant block mb-1 uppercase">YOUR NAME / PUNK ALIAS</label>
                <input
                  type="text"
                  required
                  placeholder="Snot Rocket Joe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-background border border-outline-variant p-3 font-mono text-sm text-white focus:outline-none focus:border-[#c3f400] rounded focus:ring-1 focus:ring-[#c3f400]"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-on-surface-variant block mb-2 uppercase">SELECT TIER</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* GA option */}
                  <label
                    className={`border-2 p-4 cursor-pointer flex flex-col justify-between transition-all rounded ${
                      ticketTier === 'GA'
                        ? 'border-[#c3f400] bg-[#c3f400]/10'
                        : 'border-outline-variant bg-surface-container-high hover:bg-surface-container-highest'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-headline-md text-sm uppercase text-white font-bold">General Admission</span>
                      <input
                        type="radio"
                        name="tier"
                        checked={ticketTier === 'GA'}
                        onChange={() => setTicketTier('GA')}
                        className="text-[#c3f400] focus:ring-[#c3f400] bg-background border-outline-variant"
                      />
                    </div>
                    <p className="font-body-md text-xs text-on-surface-variant leading-tight">
                      Standard floor mosh entry. Be prepared to sweat. No whining.
                    </p>
                    <span className="font-mono text-xs text-white font-bold mt-3">${gig.price}</span>
                  </label>

                  {/* VIP option */}
                  <label
                    className={`border-2 p-4 cursor-pointer flex flex-col justify-between transition-all rounded ${
                      ticketTier === 'VIP'
                        ? 'border-[#c3f400] bg-[#c3f400]/10 animate-pulse'
                        : 'border-outline-variant bg-surface-container-high hover:bg-surface-container-highest'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-headline-md text-sm uppercase text-white font-bold flex items-center gap-1">
                        VIP Snot Pass <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                      </span>
                      <input
                        type="radio"
                        name="tier"
                        checked={ticketTier === 'VIP'}
                        onChange={() => setTicketTier('VIP')}
                        className="text-[#c3f400] focus:ring-[#c3f400] bg-background border-outline-variant"
                      />
                    </div>
                    <p className="font-body-md text-xs text-on-surface-variant leading-tight">
                      Backstage access, Flying Booger sticker set, complimentary snot mocktail, and side-stage access.
                    </p>
                    <span className="font-mono text-xs text-white font-bold mt-3">${gig.price + 25}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Total display and submit */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t-2 border-dashed border-outline-variant pt-4 mt-4">
              <div className="text-center sm:text-left">
                <span className="font-mono text-xs text-on-surface-variant uppercase">TOTAL CHARGED:</span>
                <span className="font-headline-xl text-3xl text-[#c3f400] font-black block leading-none mt-1">
                  ${ticketTier === 'VIP' ? gig.price + 25 : gig.price}
                </span>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto btn-riot bg-[#c3f400] text-[#131313] px-10 py-4 uppercase font-headline-md tracking-wider font-black text-sm cursor-pointer"
              >
                Secure Snot Pass
              </button>
            </div>
          </form>
        ) : (
          /* Confirmed Ticket Stub Stage */
          <div className="space-y-6 relative select-none">
            {/* Visual Concert Ticket Stub */}
            <div className="border-4 border-white bg-stone-950 flex flex-col md:flex-row shadow-[6px_6px_0px_0px_#ffffff] relative overflow-hidden text-white rounded">
              
              {/* Left main ticket part */}
              <div className="flex-1 p-5 md:border-r-4 md:border-dashed md:border-stone-800 relative">
                {/* Slime overlay stripe */}
                <div className="absolute top-0 left-0 w-2.5 h-full bg-[#c3f400]"></div>

                <div className="pl-4">
                  {/* Top line banner */}
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant block">
                      FLYING BOOGER // STAY LOUD
                    </span>
                    <span className={`font-mono text-[10px] uppercase font-black px-1.5 py-0.5 border ${
                      ticketTier === 'VIP' ? 'bg-red-600 border-red-600 text-white animate-bounce' : 'bg-transparent border-white text-white'
                    }`}>
                      {ticketTier === 'VIP' ? 'VIP BACKSTAGE PASS' : 'GENERAL ADMISSION'}
                    </span>
                  </div>

                  {/* Main header title */}
                  <h3 className="font-headline-md text-2xl uppercase font-black tracking-tighter text-white mb-3">
                    SNOT ROCKET TOUR 2024
                  </h3>

                  {/* Date, Location, Venue */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-y border-dashed border-stone-800 py-3 mb-3">
                    <div>
                      <span className="font-mono text-[9px] text-on-surface-variant block uppercase">DATE:</span>
                      <span className="font-mono text-sm font-black text-[#c3f400]">{gig.date}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-on-surface-variant block uppercase">VENUE:</span>
                      <span className="font-headline-md text-sm uppercase font-bold text-white truncate max-w-[150px] block">{gig.venue}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-on-surface-variant block uppercase">CITY:</span>
                      <span className="font-headline-md text-sm uppercase font-bold text-white">{gig.location}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-on-surface-variant block uppercase">TICKET NUMBER:</span>
                      <span className="font-mono text-xs text-white">{ticketNumber}</span>
                    </div>
                  </div>

                  {/* Holder Name */}
                  <div>
                    <span className="font-mono text-[9px] text-on-surface-variant block uppercase">ATTENDEE NAME:</span>
                    <span className="font-mono text-sm uppercase text-white font-black italic">{userName}</span>
                  </div>
                </div>

                {/* Simulated punch holes on tear line */}
                <div className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-surface border border-primary z-20"></div>
                <div className="hidden md:block absolute -right-2 top-4 w-4 h-4 rounded-full bg-surface border border-primary z-20"></div>
                <div className="hidden md:block absolute -right-2 bottom-4 w-4 h-4 rounded-full bg-surface border border-primary z-20"></div>
              </div>

              {/* Right stub/QR code ticket part */}
              <div className="w-full md:w-48 bg-stone-900 p-5 flex flex-col items-center justify-between relative border-t-4 md:border-t-0 border-dashed border-stone-800 text-center">
                {/* Rip cut labels */}
                <span className="font-mono text-[8px] uppercase text-stone-600 block mb-2 tracking-widest">[ TEAR HERE FOR ACCESS ]</span>

                {/* QR Code Container */}
                <div className="w-28 h-28 bg-white p-1.5 shadow-md relative border border-[#c3f400]/40 group">
                  <div className="absolute inset-0 border border-dashed border-[#c3f400] opacity-50 m-0.5"></div>
                  <img
                    alt="Scan Ticket"
                    className="w-full h-full object-cover grayscale"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCigZCB8pkk0Bq0Vmn8oNzINytAKxa7hqwGhcUuzBYl7EyCxpASGEs53apyBQ-nB9Wk5Ktv7oi7EEMeirZeyrY1-f9C9BOWEPeUzugfDj--1ZpX2a41NEGUwV421l-qBSQv2A47nTxWShJ61bPNWvjoQxmZOQotoW7NUu_imBkKX3rfIf9G30bcIPol0EaS-vrFlqCEi2fp7J73LH9arjQeK-RIAEYEv3KSrUkLg9gNKQE0X6IR3PJTuW-O4mRpSJXk2TBF_xDTnT6T"
                  />
                </div>

                {/* Custom barcode under QR */}
                <div className="w-32 h-6 flex gap-0.5 items-end mt-3 justify-center select-none overflow-hidden opacity-80">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white h-full"
                      style={{
                        width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2)}px`,
                        opacity: i % 7 === 0 ? 0.3 : 0.9,
                      }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[8px] text-stone-500 mt-1">{ticketNumber}</span>
              </div>
            </div>

            {/* Instruction Callout */}
            <p className="font-body-md text-xs text-on-surface-variant italic text-center">
              * Show this digital QR pass on your mobile device at the door for rapid snot-scanning. Rock on!
            </p>

            {/* Ticket actions */}
            <div className="flex flex-wrap gap-3 justify-center border-t-2 border-dashed border-outline-variant pt-4">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 border border-white text-white px-5 py-2.5 font-mono text-xs uppercase cursor-pointer hover:bg-surface-container-high transition-colors rounded"
              >
                <Printer className="w-4 h-4" /> Print Ticket Stub
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 border border-white text-white px-5 py-2.5 font-mono text-xs uppercase cursor-pointer hover:bg-surface-container-high transition-colors rounded"
              >
                <Share2 className="w-4 h-4" /> Copy Ticket Code
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 btn-riot bg-[#c3f400] text-[#131313] px-6 py-2.5 font-headline-md text-xs uppercase cursor-pointer font-black border-2"
              >
                <Check className="w-4 h-4 stroke-3" /> Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
