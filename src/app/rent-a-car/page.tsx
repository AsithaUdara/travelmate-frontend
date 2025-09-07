"use client";

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Car, Users, Search, Filter, Grid, List, Star, Heart, User, Navigation, CheckCircle, Phone, Mail, AlertCircle, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function VehicleBookingDashboard() {
    const router = useRouter();
    const params = useSearchParams();
    const initialTab = params.get('tab') === 'bookings' ? 'bookings' : 'search';
    const [activeTab, setActiveTab] = useState<'search' | 'bookings'>(initialTab as any);
    const [searchParams, setSearchParams] = useState({
        pickupLocation: '',
        dropoffLocation: '',
        pickupDate: '',
        pickupTime: '',
        returnDate: '',
        returnTime: '',
        vehicleType: '',
        withDriver: false
    });
    const [showResults, setShowResults] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filters, setFilters] = useState({ radius: 10, vehicleType: '', priceRange: [5000, 50000], driverIncluded: '' });

    const [userBookings, setUserBookings] = useState([
        { id: 'BK34206545', vehicleId: 'v2', vehicleName: 'Toyota Hiace', vehicleType: 'Van', owner: 'City Transport Services', pickupLocation: 'Colombo Fort', dropoffLocation: 'Kandy', pickupDate: '2025-09-10', pickupTime: '08:00', returnDate: '2025-09-12', returnTime: '18:00', totalAmount: 36822.5, status: 'confirmed', withDriver: true, contactNumber: '+94715567534', bookingDate: '2025-09-07T10:30:00', features: ['AC', 'GPS', 'WiFi', 'Luggage Space'] },
        { id: 'BK34206123', vehicleId: 'v1', vehicleName: 'Toyota Corolla', vehicleType: 'Car', owner: 'Lanka Car Rentals', pickupLocation: 'Bambalapitiya', dropoffLocation: 'Mount Lavinia', pickupDate: '2025-09-15', pickupTime: '14:00', returnDate: '2025-09-15', returnTime: '20:00', totalAmount: 12500, status: 'upcoming', withDriver: false, contactNumber: '+94712345678', bookingDate: '2025-09-05T15:45:00', features: ['AC', 'GPS', 'Bluetooth', 'USB Charging'] }
    ]);

    const mockVehicles = [
        { id: 'v1', name: 'Toyota Corolla', type: 'Car', image: 'https://wptaxi.pl/wp-content/uploads/2024/09/Oklejenie-taksowki-czego-wymagaja-miasta-Bolt-1024x621-1.jpg', capacity: 4, fuelType: 'Petrol', transmission: 'Auto', basePrice: 8500, priceWithDriver: 15000, driverAvailable: true, rating: 4.7, reviews: 156, distance: '2.1 km', location: 'Colombo Fort', features: ['AC', 'GPS', 'Bluetooth', 'USB Charging'], owner: 'Lanka Car Rentals' },
        { id: 'v2', name: 'Toyota Hiace', type: 'Van', image: 'https://st3.depositphotos.com/27209332/36674/i/450/depositphotos_366742904-stock-photo-pasay-may-toyota-hiace-van.jpg', capacity: 15, fuelType: 'Diesel', transmission: 'Manual', basePrice: 18000, priceWithDriver: 25000, driverAvailable: true, rating: 4.5, reviews: 89, distance: '1.8 km', location: 'Pettah', features: ['AC', 'GPS', 'WiFi', 'Luggage Space'], owner: 'City Transport Services' },
        { id: 'v3', name: 'Suzuki Jimny', type: 'Car', image: 'https://lh3.googleusercontent.com/6FMFz0nOGgE4KQPDVBuIy0d5zDjB2ABx3kVsj1hBXPRGxfQB0v80jplGhbRh4ealhRlVefIJIdOGZVdKlVaPWv1o5XoPWfIka8rM=s1000', capacity: 4, fuelType: 'Petrol', transmission: 'Manual', basePrice: 12000, priceWithDriver: 18000, driverAvailable: true, rating: 4.8, reviews: 203, distance: '0.8 km', location: 'Kollupitiya', features: ['4WD', 'AC', 'GPS', 'Off-road Capable'], owner: 'Adventure Rentals' },
        { id: 'v4', name: 'Honda Civic', type: 'Car', image: 'https://kereta.info/wp-content/uploads/2010/10/CIvic-TAxi-400x327.jpg', capacity: 4, fuelType: 'Hybrid', transmission: 'Auto', basePrice: 11000, priceWithDriver: 17000, driverAvailable: true, rating: 4.6, reviews: 134, distance: '3.2 km', location: 'Mount Lavinia', features: ['Hybrid', 'AC', 'GPS', 'Premium Interior'], owner: 'Green Drive Lanka' },
        { id: 'v5', name: 'Yamaha FZ25', type: 'Bike', image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/54265/yamaha-fz25-rear-view32.jpeg?wm=2&q=100', capacity: 2, fuelType: 'Petrol', transmission: 'Manual', basePrice: 3500, priceWithDriver: 0, driverAvailable: false, rating: 4.4, reviews: 67, distance: '1.5 km', location: 'Bambalapitiya', features: ['Fuel Efficient', '250cc', 'Digital Display'], owner: 'Bike Hub' },
    ];

    const calculateEstimatedPrice = (vehicle: any) => {
        const baseDistance = 50; // km
        const pricePerKm = vehicle.type === 'Bus' ? 15 : vehicle.type === 'Van' ? 12 : vehicle.type === 'Bike' ? 5 : 10;
        const distancePrice = baseDistance * pricePerKm;
        const basePrice = searchParams.withDriver ? vehicle.priceWithDriver : vehicle.basePrice;
        return basePrice + distancePrice;
    };

    const filteredVehicles = mockVehicles.filter(vehicle => {
        if (searchParams.vehicleType && vehicle.type !== searchParams.vehicleType) return false;
        if (filters.vehicleType && vehicle.type !== filters.vehicleType) return false;
        if (filters.driverIncluded === 'yes' && !vehicle.driverAvailable) return false;
        if (filters.driverIncluded === 'no' && searchParams.withDriver) return false;
        const estimatedPrice = calculateEstimatedPrice(vehicle);
        if (estimatedPrice < filters.priceRange[0] || estimatedPrice > filters.priceRange[1]) return false;
        return true;
    });

    const handleSearch = () => {
        if (searchParams.pickupLocation && searchParams.pickupDate) {
            setShowResults(true);
            setActiveTab('search');
        }
    };

    const handleBookVehicle = (id: string) => {
        const selectedVehicle = mockVehicles.find(v => v.id === id)!;
        const estimatedPrice = calculateEstimatedPrice(selectedVehicle);
        const confirmed = confirm(`Book ${selectedVehicle.name} from ${selectedVehicle.owner}?\nEstimated Price: LKR ${estimatedPrice.toLocaleString()}\n\nClick OK to proceed to booking page.`);
        if (confirmed) router.push(`/rent-a-car/booking?vehicleId=${id}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

    const renderBookingsTab = () => {
        const activeBookings = userBookings.filter(booking => booking.status !== 'cancelled');
        const cancelledBookings = userBookings.filter(booking => booking.status === 'cancelled');
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border p-8">
                            <div className="flex items-center gap-3 mb-8"><CheckCircle className="w-8 h-8 text-green-600" /><div><h1 className="text-3xl font-bold text-gray-900">My Bookings</h1><p className="text-gray-600">Manage and track your vehicle bookings</p></div></div>
                            {activeBookings.length === 0 ? (
                                <div className="text-center py-12"><Car className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h3 className="text-xl font-medium text-gray-900 mb-2">No active bookings</h3><p className="text-gray-600 mb-6">Start by searching and booking your first vehicle</p><Button onClick={() => { setActiveTab('search'); setShowResults(false); }} size="lg">Book a Vehicle</Button></div>
                            ) : (
                                <div className="space-y-6">
                                    {activeBookings.map((booking) => (
                                        <div key={booking.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"><Car className="w-8 h-8 text-gray-600" /></div>
                                                        <div><h3 className="text-xl font-bold text-gray-900">{booking.vehicleName}</h3><p className="text-gray-600">{booking.owner}</p><p className="text-sm text-gray-500">Booking ID: {booking.id}</p></div>
                                                    </div>
                                                    <div className="text-right"><span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span><p className="text-2xl font-bold text-green-600 mt-2">LKR {booking.totalAmount.toLocaleString()}</p></div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                                    <div className="space-y-2"><h4 className="font-medium text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4" />Journey</h4><p className="text-gray-600">From: {booking.pickupLocation}</p><p className="text-gray-600">To: {booking.dropoffLocation}</p></div>
                                                    <div className="space-y-2"><h4 className="font-medium text-gray-900 flex items-center gap-2"><Calendar className="w-4 h-4" />Pickup</h4><p className="text-gray-600">{formatDate(booking.pickupDate)}</p><p className="text-gray-600">{booking.pickupTime}</p></div>
                                                    <div className="space-y-2"><h4 className="font-medium text-gray-900 flex items-center gap-2"><Calendar className="w-4 h-4" />Return</h4><p className="text-gray-600">{formatDate(booking.returnDate)}</p><p className="text-gray-600">{booking.returnTime}</p></div>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                                    <div className="flex items-center gap-6">
                                                        {booking.withDriver && (<span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">With Driver</span>)}
                                                        <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4" />{booking.contactNumber}</div>
                                                        <div className="flex flex-wrap gap-1">{booking.features.slice(0, 3).map((feature) => (<span key={feature} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{feature}</span>))}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {cancelledBookings.length > 0 && (
                                <div className="mt-12">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <X className="w-5 h-5 text-red-500" />
                                        Cancelled Bookings
                                    </h3>
                                    <div className="space-y-6">
                                        {cancelledBookings.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className="bg-gray-50 rounded-lg border border-gray-200"
                                            >
                                                <div className="p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                <Car className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-bold text-gray-600 line-through">
                                                                    {booking.vehicleName}
                                                                </h3>
                                                                <p className="text-gray-500">{booking.owner}</p>
                                                                <p className="text-sm text-gray-400">Booking ID: {booking.id}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span
                                                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                                    booking.status
                                                                )}`}
                                                            >
                                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                            </span>
                                                            <p className="text-xl font-bold text-gray-500 mt-2 line-through">
                                                                LKR {booking.totalAmount.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                                        <div className="text-sm text-gray-500">
                                                            Cancelled on {new Date().toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        );
    };

    const renderNavigationTabs = () => {
        const activeBookingsCount = userBookings.filter(booking => booking.status !== 'cancelled').length;
        return (
            <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Vehicle Booking Platform</h1>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button onClick={() => { setActiveTab('search'); setShowResults(false); }} className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'search' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}><Search className="w-4 h-4 inline mr-2" />Search Vehicles</button>
                            <button onClick={() => setActiveTab('bookings')} className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'bookings' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}><CheckCircle className="w-4 h-4 inline mr-2" />My Bookings ({activeBookingsCount})</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (activeTab === 'bookings') {
        return (<>{renderNavigationTabs()}{renderBookingsTab()}</>);
    }

    if (!showResults) {
        return (
            <>
                {renderNavigationTabs()}
                <div className="min-h-screen bg-gray-100">
                    <div className="max-w-4xl mx-auto px-4 py-12 pt-20">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border p-8">
                                <div className="text-center mb-8"><h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Vehicle</h2><p className="text-gray-600">Choose from cars, vans, bikes and more across Sri Lanka</p></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="w-4 h-4 inline mr-1" />Pickup Location</label><input value={searchParams.pickupLocation} onChange={(e) => setSearchParams({ ...searchParams, pickupLocation: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" placeholder="Enter pickup location" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2"><Navigation className="w-4 h-4 inline mr-1" />Drop-off Location</label><input value={searchParams.dropoffLocation} onChange={(e) => setSearchParams({ ...searchParams, dropoffLocation: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" placeholder="Enter drop-off location" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2"><Car className="w-4 h-4 inline mr-1" />Vehicle Type</label><select value={searchParams.vehicleType} onChange={(e) => setSearchParams({ ...searchParams, vehicleType: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"><option value="">Any vehicle type</option><option value="Car">Car</option><option value="Van">Van</option><option value="Bike">Bike</option><option value="tuk-tuk">Tuk-tuk</option></select></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2"><Calendar className="w-4 h-4 inline mr-1" />Pickup Date</label><input type="date" value={searchParams.pickupDate} onChange={(e) => setSearchParams({ ...searchParams, pickupDate: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" min={new Date().toISOString().split('T')[0]} /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2"><Clock className="w-4 h-4 inline mr-1" />Pickup Time</label><input type="time" value={searchParams.pickupTime} onChange={(e) => setSearchParams({ ...searchParams, pickupTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" /></div>
                                </div>
                                <div className="mt-8"><Button onClick={handleSearch} disabled={!searchParams.pickupLocation || !searchParams.dropoffLocation || !searchParams.pickupDate || !searchParams.pickupTime} size="lg" className="w-full h-14 text-lg"><span className="inline-flex items-center gap-2"><Search className="w-5 h-5" /><span>Search Available Vehicles</span></span></Button></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {renderNavigationTabs()}
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
                        <div className="w-80 space-y-6">
                            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4"><Filter className="w-5 h-5 inline mr-2" />Filters</h3>
                                <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Search Radius</label><select value={filters.radius} onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"><option value={5}>Within 5 km</option><option value={10}>Within 10 km</option><option value={20}>Within 20 km</option><option value={50}>Within 50 km</option></select></div>
                                <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label><select value={filters.vehicleType} onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"><option value="">All Types</option><option value="Car">Car</option><option value="Van">Van</option><option value="Bike">Bike</option><option value="tuk-tuk">Tuk-tuk</option></select></div>
                                <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Price Range (LKR)</label><div className="flex items-center gap-2 text-sm text-gray-600 mb-2"><span>LKR {filters.priceRange[0].toLocaleString()}</span><span>-</span><span>LKR {filters.priceRange[1].toLocaleString()}</span></div><input type="range" min="5000" max="100000" step="5000" value={filters.priceRange[1]} onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })} className="w-full accent-blue-600" /></div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border p-4">
                                <div className="flex justify-between items-center">
                                    <div><h3 className="text-xl font-semibold text-gray-900">{filteredVehicles.length} Vehicles Available</h3></div>
                                    <div className="flex items-center gap-4">
                                        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"><option>Sort by: Recommended</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Rating: High to Low</option><option>Distance: Nearest</option></select>
                                        <div className="flex border border-gray-300 rounded-lg bg-white"><button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}><Grid className="w-4 h-4" /></button><button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}><List className="w-4 h-4" /></button></div>
                                    </div>
                                </div>
                            </div>
                            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                                {filteredVehicles.map((vehicle) => {
                                    const estimatedPrice = calculateEstimatedPrice(vehicle);
                                    return (
                                        <div key={vehicle.id} className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                            <div className="p-6">
                                                <div className="flex gap-4">
                                                    <div className="relative"><img src={vehicle.image} alt={vehicle.name} className="w-32 h-24 object-cover rounded-lg" /><button className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"><Heart className="w-4 h-4 text-gray-600" /></button></div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-2"><div><h4 className="font-semibold text-lg text-gray-900">{vehicle.name}</h4><p className="text-sm text-gray-600">{vehicle.owner} • {vehicle.distance}</p></div><div className="text-right"><p className="text-2xl font-bold text-green-600">LKR {estimatedPrice.toLocaleString()}</p><p className="text-xs text-gray-500">Estimated Total</p></div></div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3"><span className="flex items-center gap-1"><Users className="w-4 h-4" />{vehicle.capacity} {vehicle.type === 'Bike' ? 'riders' : 'seats'}</span><span>{vehicle.fuelType}</span><span>{vehicle.transmission}</span>{vehicle.driverAvailable && (<span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Driver Available</span>)}</div>
                                                        <div className="flex items-center gap-2 mb-3"><div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="text-sm font-medium">{vehicle.rating}</span><span className="text-sm text-gray-500">({vehicle.reviews} reviews)</span></div></div>
                                                        <div className="flex flex-wrap gap-1 mb-4">{vehicle.features.slice(0, 4).map((feature: string) => (<span key={feature} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{feature}</span>))}{vehicle.features.length > 4 && (<span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">+{vehicle.features.length - 4} more</span>)}</div>
                                                        <div className="flex gap-3"><Button onClick={() => handleBookVehicle(vehicle.id)} className="flex-1">Book Now</Button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {filteredVehicles.length === 0 && (<div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border p-12 text-center"><Car className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h4 className="text-xl font-medium text-gray-900 mb-2">No vehicles found</h4><p className="text-gray-600">Try adjusting your search criteria or filters.</p></div>)}
                        </div>
                </div>
            </div>
        </>
    );
}
