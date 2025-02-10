import React, { useState } from 'react';

const MenuMobile = ({menuList, setSelMenu, selMenu}) => {
    const [isOpen, setIsOpen]=useState(false);
    return (
        <>
            <div className='w-full flex justify-center' onClick={()=>setIsOpen(true)}>
                <span className="icon-[gg--menu] text-white w-8 h-8"></span>
            </div>
            {
                isOpen&&
                <div className='absolute z-50 bg-white w-full left-0 top-0 h-full flex flex-col'>
                    <div className='flex justify-center mt-6 mb-2'>
                        <span className="icon-[mdi--close-circle] w-10 h-10 text-red-600" onClick={()=>setIsOpen(false)}></span>
                    </div>
                    <div className='h-8 w-full px-4 py-1 flex flex-col  gap-2'>
                        {
                            menuList.map((item, index) => (
                                <>
                                    <button className={` border rounded-full font-semibold px-4 py-1 ${index == selMenu ? "bg-greenVE-500 text-white" : "text-gray-500 hover:bg-greenVE-600"}`} onClick={() => {setSelMenu(index); setIsOpen(false)}}>{item.title}</button>
                                </>
                            ))
                        }
                    </div>
                </div>
            }
        </>
    );
};

export default MenuMobile;