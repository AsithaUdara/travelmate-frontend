import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

export default function SignInPage() {
	return (
		<div className="space-y-6">
			<div className="text-center">
				<h1 className="text-3xl font-bold text-slate-900">Sign in</h1>
				<p className="text-slate-500">Welcome back to TravelMate.lk</p>
			</div>
			<form className="space-y-4">
				<div>
					<label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
					<Input id="email" type="email" placeholder="you@example.com" required className="mt-1" />
				</div>
				<div>
					<label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
					<Input id="password" type="password" required className="mt-1" />
				</div>
				<Button type="submit" className="w-full">Sign in</Button>
			</form>
			<p className="text-center text-sm text-slate-600">
				Don&apos;t have an account?{' '}
				<Link href="/auth/sign-up" className="font-semibold text-blue-600 hover:underline">Create one</Link>
			</p>
		</div>
	);
}

