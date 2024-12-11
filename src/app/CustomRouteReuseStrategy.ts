import { RouteReuseStrategy } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
export class CacheRouteReuseStrategy implements RouteReuseStrategy {
    storedRouteHandles = new Map<string, DetachedRouteHandle>();
    allowRetriveCache: any = {
        'home': true
    };

    shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        // debugger;
        // console.log("before: ", before.url);
        // console.log("curr: ", curr.url);
        if (this.getPath(before) === 'home' && this.getPath(curr) !== 'home') { // before = to, curr = from
            this.allowRetriveCache['home'] = true;
        } else {
            this.allowRetriveCache['home'] = false;
        } return before.routeConfig === curr.routeConfig;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return this.storedRouteHandles.get(this.getPath(route)) as DetachedRouteHandle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getPath(route);
        if (this.allowRetriveCache[path]) {
            return this.storedRouteHandles.has(this.getPath(route));
        }

        return false;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getPath(route);
        if (this.allowRetriveCache.hasOwnProperty(path)) {
            return true;
        } return false;
    }

    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
        this.storedRouteHandles.set(this.getPath(route), detachedTree);
    } private getPath(route: ActivatedRouteSnapshot): string {
        if (route.routeConfig !== null && route.routeConfig.path !== null) {
            return route.routeConfig.path!;
        } return '';
    }
}