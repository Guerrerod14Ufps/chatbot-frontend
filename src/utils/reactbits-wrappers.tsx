import React, { type ReactNode } from 'react';

// Wrappers para componentes de React Bits que funcionan sin dependencias adicionales
// Estos wrappers intentan importar los componentes reales, pero si fallan, usan versiones simplificadas

interface ClickSparkProps {
  children: ReactNode;
  sparkColor?: string;
  sparkCount?: number;
}

interface BounceProps {
  children: ReactNode;
}

// Intentar importar ClickSpark, si falla usar wrapper simple
let ClickSparkComponent: React.FC<ClickSparkProps>;
let BounceComponent: React.FC<BounceProps>;

try {
  const reactbits = require('@appletosolutions/reactbits');
  ClickSparkComponent = reactbits.ClickSpark || (({ children }: ClickSparkProps) => <>{children}</>);
  BounceComponent = reactbits.Bounce || (({ children }: BounceProps) => <>{children}</>);
} catch (error) {
  // Si falla la importación, usar componentes simples sin animación
  ClickSparkComponent = ({ children }: ClickSparkProps) => <>{children}</>;
  BounceComponent = ({ children }: BounceProps) => <>{children}</>;
}

export const ClickSpark: React.FC<ClickSparkProps> = ClickSparkComponent;
export const Bounce: React.FC<BounceProps> = BounceComponent;

