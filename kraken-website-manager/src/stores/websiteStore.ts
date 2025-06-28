import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Website, WebsiteFormData } from "@/lib/validations";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface WebsiteStore {
  websites: Website[];
  pagination: PaginationInfo;
  isLoading: boolean;
  addWebsite: (websiteData: WebsiteFormData) => string;
  updateWebsite: (id: string, websiteData: WebsiteFormData) => void;
  deleteWebsite: (id: string) => void;
  getWebsite: (id: string) => Website | undefined;
  getPaginatedWebsites: (page: number, itemsPerPage: number) => Website[];
  setCurrentPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  updatePagination: () => void;
  clearWebsites: () => void;
}

const ITEMS_PER_PAGE = 10;

export const useWebsiteStore = create<WebsiteStore>()(
  persist(
    (set, get) => ({
      websites: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: ITEMS_PER_PAGE,
      },
      isLoading: false,

      addWebsite: (websiteData) => {
        const newWebsite: Website = {
          ...websiteData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => {
          const newWebsites = [...state.websites, newWebsite];
          const totalItems = newWebsites.length;
          const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

          return {
            websites: newWebsites,
            pagination: {
              ...state.pagination,
              totalItems,
              totalPages,
            },
          };
        });

        return newWebsite.id;
      },

      updateWebsite: (id: string, websiteData) => {
        set((state) => ({
          websites: state.websites.map((website) =>
            website.id === id
              ? {
                  ...website,
                  ...websiteData,
                  updatedAt: new Date(),
                }
              : website
          ),
        }));
      },

      deleteWebsite: (id: string) => {
        set((state) => {
          const newWebsites = state.websites.filter(
            (website) => website.id !== id
          );
          const totalItems = newWebsites.length;
          const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
          const currentPage = Math.min(
            state.pagination.currentPage,
            totalPages
          );

          return {
            websites: newWebsites,
            pagination: {
              ...state.pagination,
              currentPage,
              totalItems,
              totalPages,
            },
          };
        });
      },

      getWebsite: (id: string) => {
        return get().websites.find((website) => website.id === id);
      },

      getPaginatedWebsites: (
        page: number,
        itemsPerPage: number = ITEMS_PER_PAGE
      ) => {
        const { websites } = get();
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return websites.slice(startIndex, endIndex);
      },

      setCurrentPage: (page: number) => {
        set((state) => ({
          pagination: {
            ...state.pagination,
            currentPage: page,
          },
        }));
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      updatePagination: () => {
        set((state) => {
          const totalItems = state.websites.length;
          const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
          const currentPage = Math.min(state.pagination.currentPage, totalPages);

          return {
            pagination: {
              ...state.pagination,
              currentPage,
              totalItems,
              totalPages,
            },
          };
        });
      },

      clearWebsites: () => {
        set({
          websites: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: ITEMS_PER_PAGE,
          },
        });
      },
    }),
    {
      name: "website-store",
      partialize: (state) => ({
        websites: state.websites,
        pagination: state.pagination,
      }),
    }
  )
);