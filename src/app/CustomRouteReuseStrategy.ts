import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

export class FlagBasedReuseStrategy implements RouteReuseStrategy {
    private readonly storage = new Map<string, DetachedRouteHandle>();

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.routeConfig?.data?.['reusable'];
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null) {
        const routeComponentName = route.routeConfig?.component?.name;
        if (routeComponentName && handle)
            this.storage.set(routeComponentName, handle);
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return this.storage.has(route.routeConfig?.component?.name ?? '')
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return this.storage.get(route.routeConfig?.component?.name ?? '') ?? null
    }

    shouldReuseRoute(
        future: ActivatedRouteSnapshot,
        curr: ActivatedRouteSnapshot,
    ): boolean {
        return (
            future.routeConfig === curr.routeConfig ||
            future.routeConfig?.data?.['reusable']
        );
    }
}