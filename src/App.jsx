import './App.css'

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from './components/ui/navigation-menu'

import {
  Card,
  CardContent,
  CardFooter,
} from './components/ui/card'

import { Button } from './components/ui/button'


function App() {

  return (
      <div className='App'>
        <NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>|||</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>Menu</NavigationMenuLink>
        <NavigationMenuLink>Order</NavigationMenuLink>
        <NavigationMenuLink>Account</NavigationMenuLink>
        <NavigationMenuLink>Settings</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>

<Card className="w-[300px]">
  <img src="/hoodie.jpg" className="rounded-t-xl" />

  <CardContent>
    <h3 className="font-semibold">Street Hoodie</h3>
    <p className="text-muted-foreground">₦18,000</p>
  </CardContent>

  <CardFooter>
    <Button>Add to Cart</Button>
  </CardFooter>
</Card>
      </div>
  )
}

export default App 
