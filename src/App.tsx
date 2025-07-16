import React, { useState, useEffect, useRef } from "react";
import { Heart, X, RotateCcw, Sparkles } from "lucide-react";

interface Cat {
  id: number;
  url: string;
  liked: boolean;
}

interface DragOffset {
  x: number;
  y: number;
}

interface Position {
  x: number;
  y: number;
}

type SwipeDirection = "left" | "right" | null;

const CatSwipeApp: React.FC = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [likedCats, setLikedCats] = useState<Cat[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<Position>({ x: 0, y: 0 });

  // Generate unique cat images from Cataas
  const generateCats = (): Cat[] => {
    const catImages: Cat[] = [];
    for (let i = 0; i < 20; i++) {
      catImages.push({
        id: i,
        url: `https://cataas.com/cat?${i}&width=400&height=500`,
        liked: false,
      });
    }
    return catImages;
  };

  useEffect(() => {
    const catData = generateCats();
    setCats(catData);
    setIsLoading(false);
  }, []);

  const handleSwipe = (direction: SwipeDirection): void => {
    if (currentIndex >= cats.length || !direction) return;

    const currentCat = cats[currentIndex];
    setSwipeDirection(direction);

    if (direction === "right") {
      setLikedCats((prev) => [...prev, currentCat]);
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });

      if (currentIndex + 1 >= cats.length) {
        setIsComplete(true);
      }
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (currentIndex >= cats.length) return;

    const touch = e.touches[0];
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (!isDragging || currentIndex >= cats.length) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startPosRef.current.x;
    const deltaY = touch.clientY - startPosRef.current.y;

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = (): void => {
    if (!isDragging || currentIndex >= cats.length) return;

    setIsDragging(false);
    const threshold = 100;

    if (Math.abs(dragOffset.x) > threshold) {
      handleSwipe(dragOffset.x > 0 ? "right" : "left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (currentIndex >= cats.length) return;

    startPosRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!isDragging || currentIndex >= cats.length) return;

    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = (): void => {
    if (!isDragging || currentIndex >= cats.length) return;

    setIsDragging(false);
    const threshold = 100;

    if (Math.abs(dragOffset.x) > threshold) {
      handleSwipe(dragOffset.x > 0 ? "right" : "left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const resetApp = (): void => {
    setCurrentIndex(0);
    setLikedCats([]);
    setIsComplete(false);
    setSwipeDirection(null);
    setDragOffset({ x: 0, y: 0 });
    const newCats = generateCats();
    setCats(newCats);
  };

  const getCardStyle = (): React.CSSProperties => {
    const rotation = dragOffset.x * 0.1;
    const scale = isDragging ? 0.95 : 1;

    let transform = `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`;

    if (swipeDirection === "right") {
      transform = `translateX(100vw) rotate(30deg) scale(0.8)`;
    } else if (swipeDirection === "left") {
      transform = `translateX(-100vw) rotate(-30deg) scale(0.8)`;
    }

    return {
      transform,
      transition: isDragging
        ? "none"
        : "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    };
  };

  const getOverlayOpacity = (): number => {
    return Math.min(Math.abs(dragOffset.x) / 100, 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading adorable cats...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl text-center">
            <div className="mb-6">
              <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                All Done!
              </h2>
              <p className="text-gray-600">
                You liked {likedCats.length} out of {cats.length} cats
              </p>
            </div>

            {likedCats.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Your Favorites
                </h3>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {likedCats.map((cat) => (
                    <div key={cat.id} className="relative group">
                      <img
                        src={cat.url}
                        alt={`Liked cat ${cat.id}`}
                        className="w-full h-32 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-pink-500 opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-200"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={resetApp}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Swipe More Cats
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 select-none flex flex-col">
      {/* Header */}
      <div className="p-4 pt-8 text-center">
        <div className="mx-auto">
          <h1 className="text-5xl font-bold text-white mb-3">Cat Swipe</h1>
          <div className="bg-white bg-opacity-20 rounded-full px-4 py-2 text-white inline-block">
            {currentIndex + 1} / {cats.length}
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm mx-auto">
          {/* Background cards for stack effect */}
          {currentIndex + 1 < cats.length && (
            <div className="absolute inset-0 bg-white rounded-3xl shadow-lg transform scale-95 opacity-50"></div>
          )}
          {currentIndex + 2 < cats.length && (
            <div className="absolute inset-0 bg-white rounded-3xl shadow-lg transform scale-90 opacity-25"></div>
          )}

          {/* Main card */}
          {currentIndex < cats.length && (
            <div
              ref={cardRef}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
              style={getCardStyle()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Swipe overlays */}
              {dragOffset.x > 0 && (
                <div
                  className="absolute inset-0 bg-green-500 flex items-center justify-center z-10"
                  style={{ opacity: getOverlayOpacity() }}
                >
                  <div className="text-white text-8xl font-bold transform rotate-12">
                    LIKE
                  </div>
                </div>
              )}
              {dragOffset.x < 0 && (
                <div
                  className="absolute inset-0 bg-red-500 flex items-center justify-center z-10"
                  style={{ opacity: getOverlayOpacity() }}
                >
                  <div className="text-white text-8xl font-bold transform -rotate-12">
                    NOPE
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center">
                <img
                  src={cats[currentIndex].url}
                  alt={`Cat ${currentIndex + 1}`}
                  className="w-full h-96 object-cover"
                  draggable="false"
                />

                <div className="p-6 text-center w-full">
                  <h3 className="text-3xl font-semibold text-gray-800 mb-3">
                    Cat #{currentIndex + 1}
                  </h3>
                  <p className="text-xl text-gray-600">
                    Swipe right to like, left to pass
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pb-8 text-center">
        <div className="flex justify-center gap-6 mx-auto">
          <button
            onClick={() => handleSwipe("left")}
            className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-opacity-30 transition-all duration-200 transform hover:scale-110 active:scale-95"
            disabled={currentIndex >= cats.length}
          >
            <X className="w-8 h-8 text-white" />
          </button>

          <button
            onClick={() => handleSwipe("right")}
            className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-opacity-30 transition-all duration-200 transform hover:scale-110 active:scale-95"
          >
            <Heart className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatSwipeApp;
