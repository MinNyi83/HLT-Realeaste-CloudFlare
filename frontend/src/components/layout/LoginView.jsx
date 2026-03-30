import React from 'react';
import { Card, Button, Badge } from '../common/UI';

export const LoginView = ({ onGoogleLogin, onDemoLogin, isOnline, darkMode }) => (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <Card className="w-full max-w-md p-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center">
                    <img
                        src="/logo.svg"
                        alt="Htein Lin Thar"
                        className="w-48 h-auto"
                        width="192"
                        height="192"
                        fetchpriority="high"
                        loading="eager"
                    />
                </div>
                {!isOnline && <Badge variant="warning" className="mt-4 block w-fit mx-auto">Offline Mode</Badge>}
            </div>
            <Button onClick={onGoogleLogin} variant="google" className="w-full mb-4" disabled={!isOnline}>
                Sign in with Google
            </Button>
            <Button onClick={onDemoLogin} variant="secondary" className="w-full text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                Explore as Guest (Demo)
            </Button>
        </Card>
    </div>
);
