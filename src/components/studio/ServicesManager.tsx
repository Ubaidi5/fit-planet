"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

interface Trainer {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  bio: string;
  photoUrl?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: "training" | "class" | "therapy" | "other";
}

interface WorkshopEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  maxParticipants: number;
  price: number;
}

const SERVICE_CATEGORIES = [
  { value: "training", label: "Personal Training" },
  { value: "class", label: "Group Class" },
  { value: "therapy", label: "Therapy/Wellness" },
  { value: "other", label: "Other" },
];

export default function ServicesManager() {
  const [activeSection, setActiveSection] = useState<
    "services" | "trainers" | "events"
  >("services");

  // Services State
  const [services, setServices] = useState<Service[]>([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [newService, setNewService] = useState<Omit<Service, "id">>({
    name: "",
    description: "",
    price: 0,
    duration: 60,
    category: "training",
  });

  // Trainers State
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [showTrainerForm, setShowTrainerForm] = useState(false);
  const [newTrainer, setNewTrainer] = useState<Omit<Trainer, "id">>({
    name: "",
    specialization: "",
    experience: 0,
    bio: "",
    photoUrl: "",
  });

  // Events State
  const [events, setEvents] = useState<WorkshopEvent[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<WorkshopEvent, "id">>({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 60,
    maxParticipants: 20,
    price: 0,
  });

  // Service Handlers
  const handleAddService = () => {
    if (!newService.name.trim()) return;

    setServices((prev) => [
      ...prev,
      { ...newService, id: `service-${Date.now()}` },
    ]);
    setNewService({
      name: "",
      description: "",
      price: 0,
      duration: 60,
      category: "training",
    });
    setShowServiceForm(false);
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Trainer Handlers
  const handleAddTrainer = () => {
    if (!newTrainer.name.trim()) return;

    setTrainers((prev) => [
      ...prev,
      { ...newTrainer, id: `trainer-${Date.now()}` },
    ]);
    setNewTrainer({
      name: "",
      specialization: "",
      experience: 0,
      bio: "",
      photoUrl: "",
    });
    setShowTrainerForm(false);
  };

  const handleDeleteTrainer = (id: string) => {
    setTrainers((prev) => prev.filter((t) => t.id !== id));
  };

  // Event Handlers
  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;

    setEvents((prev) => [...prev, { ...newEvent, id: `event-${Date.now()}` }]);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: 60,
      maxParticipants: 20,
      price: 0,
    });
    setShowEventForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Section Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveSection("services")}
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
            activeSection === "services"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-600 hover:text-gray-900",
          )}
        >
          Services & Pricing
        </button>
        <button
          onClick={() => setActiveSection("trainers")}
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
            activeSection === "trainers"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-600 hover:text-gray-900",
          )}
        >
          Trainers
        </button>
        <button
          onClick={() => setActiveSection("events")}
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
            activeSection === "events"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-600 hover:text-gray-900",
          )}
        >
          Workshops & Events
        </button>
      </div>

      {/* Services Section */}
      {activeSection === "services" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Additional Services
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                List services like personal training, group classes, nutrition
                counseling, etc.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowServiceForm(!showServiceForm)}
            >
              {showServiceForm ? "Cancel" : "+ Add Service"}
            </Button>
          </div>

          {/* Add Service Form */}
          {showServiceForm && (
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Service Name
                  </label>
                  <Input
                    placeholder="e.g., Personal Training Session"
                    value={newService.name}
                    onChange={(e) =>
                      setNewService((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Textarea
                    rows={3}
                    placeholder="Describe the service..."
                    value={newService.description}
                    onChange={(e) =>
                      setNewService((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <Select
                    value={newService.category}
                    onChange={(e) =>
                      setNewService((prev) => ({
                        ...prev,
                        category: e.target.value as Service["category"],
                      }))
                    }
                    className="w-full"
                  >
                    {SERVICE_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    min="15"
                    step="15"
                    value={newService.duration}
                    onChange={(e) =>
                      setNewService((prev) => ({
                        ...prev,
                        duration: parseInt(e.target.value) || 60,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price (Rs.)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={newService.price}
                    onChange={(e) =>
                      setNewService((prev) => ({
                        ...prev,
                        price: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={handleAddService}
                    className="w-full"
                  >
                    Add Service
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Services List */}
          {services.length > 0 ? (
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between rounded-3xl border border-gray-900/[0.06] bg-surface p-4 shadow-soft"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {
                          SERVICE_CATEGORIES.find(
                            (c) => c.value === service.category,
                          )?.label
                        }
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {service.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>⏱️ {service.duration} min</span>
                      <span>💰 Rs. {service.price}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-gray-600">
                No services added yet. Click &quot;Add Service&quot; to start.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Trainers Section */}
      {activeSection === "trainers" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Gym Trainers
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Add trainer profiles to showcase your team
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTrainerForm(!showTrainerForm)}
            >
              {showTrainerForm ? "Cancel" : "+ Add Trainer"}
            </Button>
          </div>

          {/* Add Trainer Form */}
          {showTrainerForm && (
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Trainer Name
                  </label>
                  <Input
                    placeholder="e.g., John Doe"
                    value={newTrainer.name}
                    onChange={(e) =>
                      setNewTrainer((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <Input
                    placeholder="e.g., Strength Training, Yoga"
                    value={newTrainer.specialization}
                    onChange={(e) =>
                      setNewTrainer((prev) => ({
                        ...prev,
                        specialization: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Experience (years)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={newTrainer.experience}
                    onChange={(e) =>
                      setNewTrainer((prev) => ({
                        ...prev,
                        experience: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Photo URL (optional)
                  </label>
                  <Input
                    placeholder="https://example.com/photo.jpg"
                    value={newTrainer.photoUrl}
                    onChange={(e) =>
                      setNewTrainer((prev) => ({
                        ...prev,
                        photoUrl: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <Textarea
                    rows={3}
                    placeholder="Brief bio about the trainer..."
                    value={newTrainer.bio}
                    onChange={(e) =>
                      setNewTrainer((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <Button
                    type="button"
                    onClick={handleAddTrainer}
                    className="w-full"
                  >
                    Add Trainer
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Trainers Grid */}
          {trainers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="rounded-3xl border border-gray-900/[0.06] bg-surface p-4 shadow-soft"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-semibold text-emerald-600 tracking-tight">
                      {trainer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {trainer.name}
                      </h3>
                      <p className="text-sm text-emerald-600">
                        {trainer.specialization}
                      </p>
                      <p className="text-xs text-gray-500">
                        {trainer.experience} years exp.
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{trainer.bio}</p>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteTrainer(trainer.id)}
                    className="mt-3 w-full"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-gray-600">
                No trainers added yet. Click &quot;Add Trainer&quot; to start.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Events Section */}
      {activeSection === "events" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Workshops & Events
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Schedule special workshops, classes, or events
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEventForm(!showEventForm)}
            >
              {showEventForm ? "Cancel" : "+ Add Event"}
            </Button>
          </div>

          {/* Add Event Form */}
          {showEventForm && (
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Event Title
                  </label>
                  <Input
                    placeholder="e.g., Yoga Workshop"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Textarea
                    rows={3}
                    placeholder="Event details..."
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent((prev) => ({ ...prev, time: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    min="15"
                    step="15"
                    value={newEvent.duration}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        duration: parseInt(e.target.value) || 60,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Max Participants
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={newEvent.maxParticipants}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        maxParticipants: parseInt(e.target.value) || 20,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price (Rs.)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={newEvent.price}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        price: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <Button
                    type="button"
                    onClick={handleAddEvent}
                    className="w-full"
                  >
                    Add Event
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Events List */}
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-3xl border border-gray-900/[0.06] bg-surface p-4 shadow-soft"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {event.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                        <span>📅 {event.date}</span>
                        <span>⏰ {event.time}</span>
                        <span>⏱️ {event.duration} min</span>
                        <span>👥 Max {event.maxParticipants} people</span>
                        <span>💰 Rs. {event.price}</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-gray-600">
                No events scheduled yet. Click &quot;Add Event&quot; to start.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="button">Save Changes</Button>
      </div>
    </div>
  );
}
