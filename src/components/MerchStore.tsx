import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, CheckCircle, Tag, Sparkles } from 'lucide-react';
import { MerchItem, CartItem } from '../types';
import { MERCH_DATA } from '../data';

interface MerchStoreProps {
  onAddToCartCountChange: (count: number) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

export default function MerchStore({
  onAddToCartCountChange,
  cart,
  setCart,
  isCartOpen,
  setIsCartOpen,
}: MerchStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sizeSelections, setSizeSelections] = useState<Record<string, string>>({});
  const [checkoutComplete, setCheckoutComplete] = useState<boolean>(false);
  const [shippingInfo, setShippingInfo] = useState({ name: '', email: '', address: '', zip: '' });
  const [checkoutMode, setCheckoutMode] = useState<boolean>(false);
  const [receiptNumber, setReceiptNumber] = useState<string>('');

  const categories = ['All', 'Apparel', 'Music', 'Accessories'];

  const filteredMerch = selectedCategory === 'All'
    ? MERCH_DATA
    : MERCH_DATA.filter(item => item.category === selectedCategory);

  const handleSizeChange = (itemId: string, size: string) => {
    setSizeSelections(prev => ({ ...prev, [itemId]: size }));
  };

  const handleAddToCart = (item: MerchItem) => {
    // If it's apparel, make sure a size is selected
    const selectedSize = sizeSelections[item.id] || (item.sizes && item.sizes[0]);
    
    if (item.sizes && !sizeSelections[item.id]) {
      // Set default size if none selected
      setSizeSelections(prev => ({ ...prev, [item.id]: item.sizes![0] }));
    }

    const existingCartIndex = cart.findIndex(
      cartItem => cartItem.item.id === item.id && cartItem.selectedSize === selectedSize
    );

    let newCart = [...cart];
    if (existingCartIndex > -1) {
      newCart[existingCartIndex].quantity += 1;
    } else {
      newCart.push({
        item,
        quantity: 1,
        selectedSize: item.sizes ? selectedSize : undefined
      });
    }

    setCart(newCart);
    onAddToCartCountChange(newCart.reduce((total, i) => total + i.quantity, 0));
    
    // Open cart so user sees their item
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    let newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    setCart(newCart);
    onAddToCartCountChange(newCart.reduce((total, i) => total + i.quantity, 0));
  };

  const handleRemoveItem = (index: number) => {
    let newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    onAddToCartCountChange(newCart.reduce((total, i) => total + i.quantity, 0));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Generate random invoice
    const invoiceNum = 'FB-' + Math.floor(100000 + Math.random() * 900000);
    setReceiptNumber(invoiceNum);
    setCheckoutComplete(true);
  };

  const resetStore = () => {
    setCart([]);
    onAddToCartCountChange(0);
    setCheckoutComplete(false);
    setCheckoutMode(false);
    setIsCartOpen(false);
    setShippingInfo({ name: '', email: '', address: '', zip: '' });
  };

  // Render product visual elements cleanly in responsive SVG/CSS
  const renderProductGraphic = (imageType: string) => {
    switch (imageType) {
      case 'vinyl':
        return (
          <div className="w-full h-48 bg-background relative flex items-center justify-center overflow-hidden border-b-4 border-primary">
            {/* Vinyl record spinning sleeve */}
            <div className="absolute w-36 h-36 border border-dashed border-outline-variant rounded-lg flex items-center justify-center bg-surface-container/50">
              <div className="text-white text-4xl font-headline-xl italic text-center opacity-30 select-none">FB</div>
            </div>
            {/* Spinning Vinyl */}
            <div className="w-32 h-32 bg-stone-900 rounded-full flex items-center justify-center shadow-lg relative border-2 border-stone-800 animate-spin group-hover:scale-105 transition-transform" style={{ animationDuration: '6s' }}>
              <div className="absolute inset-2 border border-stone-700 rounded-full"></div>
              <div className="absolute inset-6 border border-stone-800 rounded-full"></div>
              <div className="absolute inset-10 border border-stone-700 rounded-full"></div>
              {/* Slime center */}
              <div className="w-10 h-10 bg-[#c3f400] rounded-full flex items-center justify-center relative border border-[#131313]">
                <div className="w-2.5 h-2.5 bg-stone-900 rounded-full"></div>
              </div>
            </div>
          </div>
        );
      case 'hoodie':
        return (
          <div className="w-full h-48 bg-background relative flex items-center justify-center overflow-hidden border-b-4 border-primary">
            <div className="absolute top-2 right-2 bg-red-600 text-white font-label-sm text-[9px] px-1.5 py-0.5 uppercase font-black -rotate-6 select-none">
              400 GSM
            </div>
            {/* Drawing of hoodie outline */}
            <svg viewBox="0 0 100 100" className="w-32 h-32 text-stone-800 fill-[#201f1f] stroke-white stroke-2">
              {/* Hoodie Body */}
              <path d="M 25 35 L 75 35 L 80 85 L 20 85 Z" />
              {/* Sleeves */}
              <path d="M 25 35 L 5 65 L 12 70 L 23 48 Z" />
              <path d="M 75 35 L 95 65 L 88 70 L 77 48 Z" />
              {/* Hood */}
              <path d="M 35 35 C 35 15, 65 15, 65 35 Z" fill="#2a2a2a" />
              {/* Pocket */}
              <path d="M 35 65 L 65 65 L 70 80 L 30 80 Z" fill="#353534" />
              {/* Spray print icon */}
              <path d="M 42 42 L 58 58 M 58 42 L 42 58" stroke="#c3f400" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        );
      case 'tee':
        return (
          <div className="w-full h-48 bg-background relative flex items-center justify-center overflow-hidden border-b-4 border-primary">
            {/* Vintage Washed Tee */}
            <svg viewBox="0 0 100 100" className="w-32 h-32 text-stone-950 fill-[#1c1b1b] stroke-white stroke-2">
              <path d="M 20 30 L 35 20 L 50 25 L 65 20 L 80 30 L 72 50 L 68 50 L 68 85 L 32 85 L 32 50 L 28 50 Z" />
              {/* Graphic Logo on Tee */}
              <text x="50" y="55" fill="#c3f400" stroke="none" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="Anybody" fontStyle="italic">FLYING</text>
              <text x="50" y="65" fill="#ffffff" stroke="none" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="Anybody" fontStyle="italic">BOOGER</text>
            </svg>
          </div>
        );
      case 'patches':
        return (
          <div className="w-full h-48 bg-background relative flex items-center justify-center overflow-hidden border-b-4 border-primary gap-2">
            {/* Retro stitched look patches */}
            <div className="w-14 h-14 bg-[#2a2a2a] border-2 border-dashed border-red-500 rounded-full flex items-center justify-center rotate-12 relative shadow">
              <span className="material-symbols-outlined text-red-500 text-3xl">bolt</span>
            </div>
            <div className="w-14 h-14 bg-[#c3f400] border-2 border-dashed border-black rounded flex items-center justify-center -rotate-6 relative shadow">
              <span className="font-headline-xl text-black text-xs font-black">STAY LOUD</span>
            </div>
            <div className="w-12 h-12 bg-white border-2 border-dashed border-indigo-600 rounded-full flex items-center justify-center rotate-3 relative shadow">
              <span className="material-symbols-outlined text-indigo-600 text-2xl">star</span>
            </div>
          </div>
        );
      case 'beanie':
        return (
          <div className="w-full h-48 bg-background relative flex items-center justify-center overflow-hidden border-b-4 border-primary">
            {/* Neon lime beanie */}
            <svg viewBox="0 0 100 100" className="w-28 h-28 text-[#c3f400] fill-[#c3f400] stroke-black stroke-2">
              {/* Crown of beanie */}
              <path d="M 25 70 C 25 35, 75 35, 75 70 Z" />
              {/* Folded cuff */}
              <rect x="20" y="65" width="60" height="15" rx="3" fill="#abd600" />
              {/* Stitch patch */}
              <rect x="38" y="68" width="24" height="9" rx="1" fill="#131313" stroke="white" strokeWidth="1" />
              <text x="50" y="75" fill="#ffffff" stroke="none" fontSize="4" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">BOOGER</text>
              {/* Pom pom */}
              <circle cx="50" cy="35" r="5" fill="#c3f400" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-full h-48 bg-surface-container-high flex items-center justify-center border-b-4 border-primary">
            <ShoppingBag className="w-12 h-12 text-[#c3f400]" />
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {/* Category Selection Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 border-2 font-label-md text-xs uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === category
                ? 'bg-[#c3f400] text-[#131313] border-white font-black translate-x-[-2px] translate-y-[-2px] shadow-[4px_4px_0px_0px_#ffffff]'
                : 'bg-surface-container text-on-surface-variant border-outline-variant hover:text-white hover:bg-surface-container-high'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Merch Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {filteredMerch.map((item) => (
          <div
            key={item.id}
            className="group bg-surface-container border-4 border-primary p-0 flex flex-col justify-between hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_#c3f400] transition-all"
          >
            {/* Image / Graphic placeholder */}
            {renderProductGraphic(item.image)}

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="font-mono text-[10px] text-primary-container bg-surface-container-high px-2 py-0.5 border border-[#c3f400]/20 uppercase">
                    {item.category}
                  </span>
                  <span className="font-headline-md text-xl text-[#c3f400] font-black">${item.price}</span>
                </div>
                <h3 className="font-headline-md text-base uppercase text-white mb-2 tracking-tight line-clamp-1 group-hover:text-[#c3f400] transition-colors">
                  {item.name}
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant mb-4 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Apparel Sizes Selection */}
              {item.sizes && (
                <div className="mb-4">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">SELECT SIZE:</span>
                  <div className="flex gap-1">
                    {item.sizes.map(size => {
                      const isSelected = sizeSelections[item.id] === size;
                      return (
                        <button
                          key={size}
                          onClick={() => handleSizeChange(item.id, size)}
                          className={`w-7 h-7 text-xs font-mono border transition-all cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'bg-white text-black font-black border-white'
                              : 'bg-background hover:bg-surface-container-high text-on-surface-variant border-outline-variant'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to Cart button */}
              <button
                onClick={() => handleAddToCart(item)}
                className="w-full btn-riot bg-primary-container text-on-primary-container py-2.5 uppercase font-headline-md text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer font-black border-2"
              >
                <ShoppingBag className="w-4 h-4 fill-current" /> Add to Snot Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Drawer / Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-surface border-l-4 border-primary h-full flex flex-col justify-between shadow-2xl relative">
              {/* Grain Overlay */}
              <div className="absolute inset-0 grain-texture z-0 pointer-events-none"></div>

              {/* Header */}
              <div className="relative z-10 p-6 border-b-4 border-primary flex items-center justify-between bg-surface-container">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-[#c3f400]" />
                  <h2 className="font-headline-md text-xl uppercase tracking-tighter text-white">YOUR SNOT BAG</h2>
                  <span className="bg-primary-container text-on-primary-container font-mono text-[10px] font-black px-2 py-0.5 rounded-full">
                    {cart.reduce((total, i) => total + i.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 border border-outline hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 relative z-10 select-none">
                {checkoutComplete ? (
                  /* Checkout Receipt view */
                  <div className="text-center py-8">
                    <div className="inline-flex p-4 rounded-full bg-primary-container/20 border border-[#c3f400]/40 text-[#c3f400] mb-4 animate-bounce">
                      <CheckCircle className="w-12 h-12" />
                    </div>
                    <h3 className="font-headline-md text-2xl uppercase italic text-white mb-2">THANK YOU FOR THE NOISE!</h3>
                    <p className="font-body-md text-sm text-on-surface-variant mb-6">
                      Your order has been registered on the server. Your credit card was charged $0.00 since this is a demo. Let's scream!
                    </p>

                    {/* Highly stylized punk invoice */}
                    <div className="bg-surface-container-lowest border-2 border-dashed border-[#c3f400] p-4 text-left font-mono text-xs text-[#c4c9ac] mb-6 relative">
                      {/* Rip cut accents */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-[radial-gradient(circle,transparent_20%,#0e0e0e_20%)] bg-[length:10px_10px] transform rotate-180"></div>
                      <div className="text-center font-bold text-white border-b border-outline-variant pb-2 mb-2">
                        *** OFFICIAL FLYING BOOGER INVOICE ***
                      </div>
                      <p className="flex justify-between"><span>INVOICE ID:</span> <span className="text-[#c3f400] font-bold">{receiptNumber}</span></p>
                      <p className="flex justify-between"><span>SHIP TO:</span> <span>{shippingInfo.name}</span></p>
                      <p className="flex justify-between"><span>EMAIL:</span> <span className="truncate max-w-[200px]">{shippingInfo.email}</span></p>
                      <p className="flex justify-between border-b border-outline-variant pb-2 mb-2"><span>ZIP CODE:</span> <span>{shippingInfo.zip}</span></p>
                      
                      <div className="space-y-1 mb-2">
                        {cart.map((cartItem, idx) => (
                          <div key={idx} className="flex justify-between text-[11px]">
                            <span className="truncate max-w-[180px]">
                              {cartItem.quantity}x {cartItem.item.name} {cartItem.selectedSize ? `(${cartItem.selectedSize})` : ''}
                            </span>
                            <span>${cartItem.item.price * cartItem.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-dashed border-outline-variant pt-2 mt-2 flex justify-between font-bold text-[#c3f400] text-sm">
                        <span>TOTAL PAID:</span>
                        <span>${cartTotal}</span>
                      </div>
                      <div className="text-center text-[10px] opacity-60 mt-4 leading-none">
                        STAY LOUD OR DIE. SLIME FOR LIFE.<br/>
                        PRINTED ON 100% RECYCLED STATIC MEMORY.
                      </div>
                    </div>

                    <button
                      onClick={resetStore}
                      className="btn-riot w-full bg-[#c3f400] text-[#131313] py-3 uppercase font-headline-md tracking-wider font-black text-sm cursor-pointer"
                    >
                      Clear & Back to Shop
                    </button>
                  </div>
                ) : checkoutMode ? (
                  /* Checkout Shipping Form */
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div className="border-b-2 border-[#c3f400] pb-2">
                      <span className="font-mono text-[10px] text-[#c3f400] tracking-widest uppercase">STAGE 2 // SECURE ORDER</span>
                      <h3 className="font-headline-md text-xl uppercase text-white font-black">WHERE TO SEND THE NOISE?</h3>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="font-mono text-xs text-on-surface-variant block mb-1">YOUR NAME // ALIAS</label>
                        <input
                          type="text"
                          required
                          placeholder="Joey Ramone"
                          value={shippingInfo.name}
                          onChange={e => setShippingInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-background border border-outline-variant p-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#c3f400] rounded focus:ring-1 focus:ring-[#c3f400]"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-xs text-on-surface-variant block mb-1">EMAIL ADDRESS</label>
                        <input
                          type="email"
                          required
                          placeholder="joey@stayloud.com"
                          value={shippingInfo.email}
                          onChange={e => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-background border border-outline-variant p-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#c3f400] rounded focus:ring-1 focus:ring-[#c3f400]"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-xs text-on-surface-variant block mb-1">SHIPPING STREET ADDRESS</label>
                        <input
                          type="text"
                          required
                          placeholder="742 Evergreen Terrace"
                          value={shippingInfo.address}
                          onChange={e => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full bg-background border border-outline-variant p-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#c3f400] rounded focus:ring-1 focus:ring-[#c3f400]"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-xs text-on-surface-variant block mb-1">POSTAL / ZIP CODE</label>
                        <input
                          type="text"
                          required
                          placeholder="10001"
                          value={shippingInfo.zip}
                          onChange={e => setShippingInfo(prev => ({ ...prev, zip: e.target.value }))}
                          className="w-full bg-background border border-outline-variant p-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#c3f400] rounded focus:ring-1 focus:ring-[#c3f400]"
                        />
                      </div>
                    </div>

                    {/* Order summary mini list */}
                    <div className="bg-surface-container-high border border-outline-variant p-3 rounded font-mono text-xs space-y-1 text-on-surface-variant">
                      <div className="flex justify-between border-b border-outline-variant pb-1 mb-1 font-bold text-white uppercase">
                        <span>Items List</span>
                        <span>Subtotal</span>
                      </div>
                      {cart.map((cartItem, idx) => (
                        <div key={idx} className="flex justify-between text-[11px]">
                          <span className="truncate max-w-[200px]">
                            {cartItem.quantity}x {cartItem.item.name} {cartItem.selectedSize ? `(${cartItem.selectedSize})` : ''}
                          </span>
                          <span>${cartItem.item.price * cartItem.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t border-outline-variant pt-1.5 mt-1.5 font-bold text-[#c3f400] text-sm">
                        <span>EST. TOTAL:</span>
                        <span>${cartTotal}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutMode(false)}
                        className="w-1/3 border border-outline text-white py-3 font-mono text-xs uppercase cursor-pointer hover:bg-surface-container-high rounded"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 btn-riot bg-[#c3f400] text-[#131313] py-3 uppercase font-headline-md tracking-wider font-black text-sm cursor-pointer"
                      >
                        Pay & Complete
                      </button>
                    </div>
                  </form>
                ) : cart.length === 0 ? (
                  /* Empty Cart state */
                  <div className="h-full flex flex-col justify-center items-center text-center py-16 gap-4">
                    <div className="w-16 h-16 border-2 border-dashed border-outline-variant rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-on-surface-variant" />
                    </div>
                    <div>
                      <h4 className="font-headline-md text-lg uppercase text-white mb-1">Your Snot Bag is Empty</h4>
                      <p className="font-body-md text-xs text-on-surface-variant max-w-xs">
                        Grab some stickers, vinyl, or high-weight threads to support the noise. Don't be quiet!
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Cart list view */
                  <div className="space-y-4">
                    <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 border-b border-outline-variant pb-2">
                      <Tag className="w-3 h-3 text-[#c3f400]" /> SELECTED NOISE FOR SHIPMENT
                    </p>

                    <div className="space-y-3">
                      {cart.map((cartItem, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-surface-container-high border-2 border-primary p-3 shadow-[4px_4px_0px_0px_#2a2a2a]"
                        >
                          <div className="flex-1 min-w-0 pr-3">
                            <h4 className="font-headline-md text-sm uppercase text-white truncate">
                              {cartItem.item.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {cartItem.selectedSize && (
                                <span className="font-mono text-[9px] bg-background text-[#c3f400] border border-[#c3f400]/20 px-1 py-0.5 rounded font-black">
                                  SIZE: {cartItem.selectedSize}
                                </span>
                              )}
                              <span className="font-mono text-[10px] text-on-surface-variant">
                                ${cartItem.item.price} each
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Quantity buttons */}
                            <div className="flex items-center bg-background border border-outline-variant rounded overflow-hidden">
                              <button
                                onClick={() => handleUpdateQuantity(idx, -1)}
                                className="px-2 py-1 text-on-surface-variant hover:text-white hover:bg-surface-container-high cursor-pointer transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs font-bold text-white px-2">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(idx, 1)}
                                className="px-2 py-1 text-on-surface-variant hover:text-white hover:bg-surface-container-high cursor-pointer transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Delete */}
                            <button
                              onClick={() => handleRemoveItem(idx)}
                              className="text-on-surface-variant hover:text-red-500 transition-colors p-1 cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {!checkoutComplete && cart.length > 0 && (
                <div className="relative z-10 p-6 border-t-4 border-primary bg-surface-container">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-headline-md text-sm uppercase text-on-surface-variant">SUBTOTAL:</span>
                    <span className="font-headline-xl text-3xl text-[#c3f400] font-black">${cartTotal}</span>
                  </div>

                  {!checkoutMode ? (
                    <button
                      onClick={() => setCheckoutMode(true)}
                      className="w-full btn-riot bg-[#c3f400] text-[#131313] py-3 uppercase font-headline-md tracking-wider text-sm flex items-center justify-center gap-2 font-black border-2 cursor-pointer"
                    >
                      SECURE CHECKOUT <Sparkles className="w-4 h-4 fill-current" />
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
