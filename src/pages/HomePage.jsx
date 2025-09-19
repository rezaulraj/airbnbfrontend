import React, { useEffect } from "react";
import { useHostStore } from "../store/useHostStore";

const HomePage = () => {
  const { publicProperties, loading, fetchPublicProperties } = useHostStore();

  useEffect(() => {
    fetchPublicProperties();
  }, [fetchPublicProperties]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-50">
      <h1 className="text-3xl font-bold mb-8">Explore Properties</h1>

      {publicProperties.length === 0 ? (
        <p className="text-gray-500">No properties available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {publicProperties.map((property) => (
            <div
              key={property._id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
            >
              {property.images && property.images[0] ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              <div className="p-4">
                <h3 className="text-lg font-semibold">{property.title}</h3>
                <p className="text-gray-600 mt-1">{property.description}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-800">
                    ${property.pricePerNight}/night
                  </span>
                  <span className="text-sm text-gray-500">
                    Host: {property.host.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
