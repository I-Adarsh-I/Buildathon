"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

const steps = ["Campaign Details", "Budget", "Targeting", "Creator Criteria"];

export default function CampaignDialogStepper() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    objective: "",
    images: [""],
    budget: { total: "", perInfluencer: "" },
    platforms: [""],
    hashtags: [""],
    languagePreferences: [""],
    creatorCriteria: { niche: "", minFollowers: "", maxFollowers: "" }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("budget.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        budget: { ...prev.budget, [key]: value }
      }));
    } else if (name.startsWith("creatorCriteria.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        creatorCriteria: { ...prev.creatorCriteria, [key]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (key: keyof typeof formData, index: number, value: string) => {
    const updated = [...(formData[key] as string[])];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [key]: updated }));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <Label>Title</Label>
            <Input name="title" value={formData.title} onChange={handleChange} />
            <Label>Objective</Label>
            <Input name="objective" value={formData.objective} onChange={handleChange} />
            <Label>Images</Label>
            {formData.images.map((img, i) => (
              <Input key={i} value={img} onChange={(e) => handleArrayChange("images", i, e.target.value)} placeholder={`Image ${i + 1}`} />
            ))}
          </>
        );
      case 1:
        return (
          <>
            <Label>Total Budget</Label>
            <Input name="budget.total" type="number" value={formData.budget.total} onChange={handleChange} />
            <Label>Per Influencer</Label>
            <Input name="budget.perInfluencer" type="number" value={formData.budget.perInfluencer} onChange={handleChange} />
          </>
        );
      case 2:
        return (
          <>
            <Label>Platforms</Label>
            {formData.platforms.map((p, i) => (
              <Input key={i} value={p} onChange={(e) => handleArrayChange("platforms", i, e.target.value)} placeholder={`Platform ${i + 1}`} />
            ))}
            <Label>Hashtags</Label>
            {formData.hashtags.map((h, i) => (
              <Input key={i} value={h} onChange={(e) => handleArrayChange("hashtags", i, e.target.value)} placeholder={`Hashtag ${i + 1}`} />
            ))}
            <Label>Languages</Label>
            {formData.languagePreferences.map((lang, i) => (
              <Input key={i} value={lang} onChange={(e) => handleArrayChange("languagePreferences", i, e.target.value)} placeholder={`Language ${i + 1}`} />
            ))}
          </>
        );
      case 3:
        return (
          <>
            <Label>Niche</Label>
            <Input name="creatorCriteria.niche" value={formData.creatorCriteria.niche} onChange={handleChange} />
            <Label>Min Followers</Label>
            <Input name="creatorCriteria.minFollowers" type="number" value={formData.creatorCriteria.minFollowers} onChange={handleChange} />
            <Label>Max Followers</Label>
            <Input name="creatorCriteria.maxFollowers" type="number" value={formData.creatorCriteria.maxFollowers} onChange={handleChange} />
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
    setOpen(false);
    setStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Campaign</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center">Create Campaign</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          {steps.map((label, i) => (
            <div key={i} className="flex flex-col items-center text-sm font-medium">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i < step ? "bg-green-500 text-white" :
                  i === step ? "bg-blue-600 text-white" :
                  "bg-gray-300 text-gray-700"
                }`}
              >
                {i < step ? <Check size={18} /> : i + 1}
              </div>
              <span className="mt-1 text-center w-20 text-xs">{label}</span>
            </div>
          ))}
        </div>

        {/* Step Form */}
        <div className="space-y-3">{renderStep()}</div>

        {/* Step Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
