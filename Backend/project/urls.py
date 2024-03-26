"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from project import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from project import settings
from EasyTrade.views import ProductViewSet, OrderViewSet, ReviewViewSet, WishlistViewSet, CheckoutAPIView, CategoryViewSet, get_products, get_product_by_id,products_by_category, ProductByCategoryAPIView, search_products,ProductSearchAPIView,search
from users.views import UserDetail, UserList, UserViewSet

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'review', ReviewViewSet)
router.register(r'wishlists', WishlistViewSet)
router.register(r"users", UserViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path("users/", include("users.urls")),
    path('register/', UserList.as_view(), name='register'),
    path('login/', UserList.as_view(), name='login'),
    path('users/', UserList.as_view(), name='user-list'),
    path('<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('checkout/', CheckoutAPIView.as_view(), name='checkout'),
    path('product/', get_products, name='get_products'),
    path('product/<int:product_id>/', get_product_by_id, name='get_product_by_id'),
    path('search/', search, name='search-products'),
    path('products/search/', ProductSearchAPIView.as_view(), name='product-search'),
    path('productcat/<str:category>/', ProductByCategoryAPIView.as_view(), name='product-by-category'),
    path('catproduct/<str:category>/', products_by_category),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)