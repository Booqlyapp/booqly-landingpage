import Image from 'next/image';

export default function PoweredBy() {
  return (
    <div className="flex items-center justify-center gap-3 py-6 border-t border-gray-200">      
      {/* Text and logo stacked vertically */}
      <div className="flex gap-2">
        <span className="text-gray-600">Powered by:</span>
        <Image 
          src="/images/booqlytextlogoblue.png" 
          alt="Booqly" 
          width={80} 
          height={24}
          className="h-6 w-auto"
        />
      </div>
    </div>
  );
}
