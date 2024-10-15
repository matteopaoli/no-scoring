import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import NavbarLinks from '@/app/components/navbar/NavbarLinks';
import { User } from '@/app/db';

type NavbarProps = {
	brandText: string,
	variant: string,
	secondary: boolean,
	fixed: boolean,
	onOpen: () => void;
  message: string
  routes: unknown[],
  logoText: string
	user: User
};


export default function Navbar({ secondary, message, brandText, routes, onOpen, fixed, logoText, user }: NavbarProps) {
	const [ scrolled, setScrolled ] = useState(false);

	useEffect(() => {
		window?.addEventListener('scroll', changeNavbar);

		return () => {
			window?.removeEventListener('scroll', changeNavbar);
		};
	});

	// Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
	let mainText = useColorModeValue('navy.700', 'white');
	let secondaryText = useColorModeValue('gray.700', 'white');
	let navbarPosition = 'fixed';
	let navbarFilter = 'none';
	let navbarBackdrop = 'blur(20px)';
	let navbarShadow = 'none';
	let navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');
	let navbarBorder = 'transparent';
	let secondaryMargin = '0px';
	let paddingX = '15px';
	let gap = '0px';

	const changeNavbar = () => {
		if (window && window.scrollY > 1) {
			setScrolled(true);
		} else {
			setScrolled(false);
		}
	};

	return (
		<Box
			position={navbarPosition}
			boxShadow={navbarShadow}
			bg={navbarBg}
			borderColor={navbarBorder}
			filter={navbarFilter}
			backdropFilter={navbarBackdrop}
			backgroundPosition='center'
			backgroundSize='cover'
			borderRadius='16px'
			borderWidth='1.5px'
			borderStyle='solid'
			transitionDelay='0s, 0s, 0s, 0s'
			transitionDuration=' 0.25s, 0.25s, 0.25s, 0s'
			transition-property='box-shadow, background-color, filter, border'
			transitionTimingFunction='linear, linear, linear, linear'
			alignItems={{ xl: 'center' }}
			display={secondary ? 'block' : 'flex'}
			minH='75px'
			justifyContent={{ xl: 'center' }}
			lineHeight='25.6px'
			mx='auto'
			mt={secondaryMargin}
			pb='8px'
			right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
			px={{
				sm: paddingX,
				md: '10px'
			}}
			ps={{
				xl: '12px'
			}}
			pt='8px'
			top={{ base: '12px', md: '16px', lg: '20px', xl: '20px' }}
			w={{
				base: 'calc(100vw - 6%)',
				md: 'calc(100vw - 8%)',
				lg: 'calc(100vw - 6%)',
				xl: 'calc(100vw - 350px)',
				'2xl': 'calc(100vw - 365px)'
			}}>
			<Flex
				w='100%'
				flexDirection={{
					sm: 'column',
					md: 'row'
				}}
				alignItems={{ xl: 'center' }}
				mb={gap}>
				<Box mb={{ sm: '8px', md: '0px' }}>
					<Breadcrumb>
						<BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
							<BreadcrumbLink href='#' color={secondaryText}>
								Home
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
							<BreadcrumbLink href='#' color={secondaryText}>
								{brandText}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
					{/* Here we create navbar brand, based on route name */}
					<Link
						color={mainText}
						href='#'
						bg='inherit'
						borderRadius='inherit'
						fontWeight='bold'
						fontSize='34px'
						_hover={{ color: { mainText } }}
						_active={{
							bg: 'inherit',
							transform: 'none',
							borderColor: 'transparent'
						}}
						_focus={{
							boxShadow: 'none'
						}}>
						{brandText}
					</Link>
				</Box>
				<Box ms='auto' w={{ sm: '100%', md: 'unset' }}>
					<NavbarLinks
						onOpen={onOpen}
						logoText={logoText}
						secondary={secondary}
						fixed={fixed}
						scrolled={scrolled}
						routes={routes}
						user={user}
					/>
				</Box>
			</Flex>
			{secondary ? <Text color='white'>{message}</Text> : null}
		</Box>
	);
}