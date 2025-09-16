"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProfileApi } from '@/hooks/use-profile-api'
import { useAuth } from '@/contexts/auth-context'
import { useState } from 'react'
import { toast } from 'sonner'

const Personal = () => {
    const { user } = useAuth();
    const { updateProfile } = useProfileApi();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile.mutateAsync(formData);
            toast.success('Profile updated successfully');
        } catch (error: unknown) {
            const errorMessage = error && typeof error === 'object' && 'response' in error 
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
                : 'Failed to update profile';
            toast.error(errorMessage);
        }
    };

    return (
        <>
            <form className="space-y-3 mt-3 max-w-lg" onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Name
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        className="mt-1 h-12"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone number (WhatsApp number)
                    </Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="text"
                        placeholder="Enter your phone number"
                        className="mt-1 h-12"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="mt-1 h-12"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-[#1B7339] hover:bg-green-700 mt-3"
                    disabled={updateProfile.isPending}
                >
                    {updateProfile.isPending ? 'Saving...' : 'Save changes'}
                </Button>
            </form>
        </>
    )
}

export default Personal